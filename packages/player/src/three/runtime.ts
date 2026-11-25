import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { ModelLayer, ModelMaterial } from '../types';
import { BLEED_3D, type Module3D, type Runtime3D, type State3D } from '../model3d';
import fontJson from './font-inter-800.json';

/**
 * The 3D runtime: one small three.js scene per 3D layer. Draws only when asked (render(state)), so it
 * costs nothing while the scene is still, and every frame depends only on the state it is given.
 */

const DEG = Math.PI / 180;
const FOV = 22;
/** The canvas reaches this far past the layer's box on each side (a fraction of the box), so an object that turns or orbits isn't cut off at the box edge. */
const BLEED = BLEED_3D;
let font: ReturnType<FontLoader['parse']> | null = null;
const getFont = () => (font ??= new FontLoader().parse(fontJson as never));

function makeMaterial(m: ModelMaterial | undefined, fallbackColor = '#2ad38b'): THREE.MeshPhysicalMaterial {
  const color = new THREE.Color(m?.color || fallbackColor);
  const finish = m?.finish ?? 'glossy';
  const look: Record<string, Partial<THREE.MeshPhysicalMaterialParameters>> = {
    matte: { roughness: 0.9, metalness: 0 },
    satin: { roughness: 0.5, metalness: 0 },
    glossy: { roughness: 0.2, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08 },
    metal: { roughness: 0.32, metalness: 1 },
    chrome: { roughness: 0.04, metalness: 1 },
  };
  return new THREE.MeshPhysicalMaterial({ color, ...(look[finish] ?? look.glossy) });
}

async function svgMarkup(src: string): Promise<string> {
  const t = src.trim();
  if (t.startsWith('<')) return t;
  if (t.startsWith('data:')) {
    const comma = t.indexOf(',');
    const meta = t.slice(0, comma);
    const body = t.slice(comma + 1);
    return meta.includes(';base64') ? atob(body) : decodeURIComponent(body);
  }
  const r = await fetch(t);
  if (!r.ok) throw new Error(`Could not load the SVG (${r.status}).`);
  return r.text();
}

// ---- Devices: a generic phone, tablet, laptop or monitor whose screen shows a picture or plays a video ----

/** A rounded rectangle centred on the origin. */
function rrShape(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** A flat rounded rectangle facing +z, with texture coordinates running 0 to 1 across it. */
function rrPlane(w: number, h: number, r: number): THREE.BufferGeometry {
  const g = new THREE.ShapeGeometry(rrShape(w, h, r), 24);
  const pos = g.getAttribute('position');
  const uv = g.getAttribute('uv');
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  uv.needsUpdate = true;
  return g;
}

/** A slab with rounded corners and softened edges, centred on the origin, front face at z = d / 2. */
function slab(w: number, h: number, d: number, r: number, edge = Math.min(0.02, d * 0.3)): THREE.BufferGeometry {
  const g = new THREE.ExtrudeGeometry(rrShape(w - 2 * edge, h - 2 * edge, Math.max(0.001, r - edge)), {
    depth: Math.max(0.001, d - 2 * edge), bevelEnabled: true, bevelThickness: edge, bevelSize: edge, bevelSegments: 4, curveSegments: 24,
  });
  g.translate(0, 0, -Math.max(0.001, d - 2 * edge) / 2);
  g.computeVertexNormals();
  return g;
}

const VIDEO_RE = /^data:video\/|\.(mp4|webm|mov|m4v|ogv)([?#]|$)/i;
const IMAGE_RE = /^data:image\/|\.(png|jpe?g|webp|gif|avif|svg)([?#]|$)/i;

/** A device's screen: the picture or video on it, kept in step with the scene's clock. */
interface DeviceScreen {
  /** Plays the video at the layer's time while the scene plays; seeks it exactly when paused, scrubbed or exported. */
  sync(t: number, playing: boolean): void;
  dispose(): void;
}

/**
 * Puts the screen's picture or video on a flat screen of sw × sh (corner radius sr) at z, inside parent. The content
 * is unlit, so a screencast keeps its true colours at any angle. `turned`: the device lies on its side (the content
 * stays upright, so the screen is measured the other way round).
 */
function makeScreen(parent: THREE.Object3D, layer: ModelLayer, sw: number, sh: number, sr: number, z: number,
  ctx: BuildContext, cy = 0): DeviceScreen | null {
  const m = layer.model;
  const src = (m.screen ?? '').trim();
  // "local:" is the Studio's own name for a file kept in the browser; it swaps in a playable address before showing it.
  if (!src || src.startsWith('local:')) return null;
  const fit = m.fit ?? 'cover';
  let video: HTMLVideoElement | null = null;
  let texture: THREE.Texture | null = null;
  let mesh: THREE.Mesh | null = null;
  let gone = false;

  /** Sizes the content to the screen once the picture's own shape is known. */
  const place = (tex: THREE.Texture, mw: number, mh: number) => {
    if (gone) { tex.dispose(); return; }
    texture = tex;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = ctx.aniso;
    const ma = mw > 0 && mh > 0 ? mw / mh : sw / sh;
    const sa = sw / sh;
    let geo: THREE.BufferGeometry;
    if (fit === 'contain') {
      // All of the picture, with the dark screen showing round it.
      const w = ma > sa ? sw : sh * ma;
      const h = ma > sa ? sw / ma : sh;
      geo = rrPlane(w, h, Math.min(sr, Math.min(w, h) * 0.1));
    } else {
      // Crop to fill: the middle of the picture, as big as the screen.
      geo = rrPlane(sw, sh, sr);
      if (ma > sa) { tex.repeat.set(sa / ma, 1); tex.offset.set((1 - sa / ma) / 2, 0); }
      else { tex.repeat.set(1, ma / sa); tex.offset.set(0, (1 - ma / sa) / 2); }
    }
    mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    mesh.position.set(0, cy, z);
    parent.add(mesh);
    // Upload the first frame now: a paused video gives the texture no new frame until something seeks it.
    tex.needsUpdate = true;
    ctx.redraw();
  };

  const asVideo = () => {
    const v = document.createElement('video');
    video = v;
    v.crossOrigin = 'anonymous';
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.setAttribute('aria-hidden', 'true');
    // Kept in the page (a hidden video is not decoded everywhere) but out of sight; the player's settle() waits for it.
    Object.assign(v.style, { position: 'absolute', left: '0', top: '0', width: '2px', height: '2px', opacity: '0', pointerEvents: 'none' });
    ctx.host.appendChild(v);
    const tex = new THREE.VideoTexture(v);
    tex.generateMipmaps = false;
    const repaint = () => { tex.needsUpdate = true; ctx.redraw(); };
    v.addEventListener('loadeddata', () => { if (!mesh) place(tex, v.videoWidth, v.videoHeight); else repaint(); }, { once: true });
    v.addEventListener('seeked', repaint);
    v.addEventListener('error', () => console.warn('[Unyson+ scene] 3D device "' + layer.id + '": the screen video could not be loaded.'));
    v.src = src;
  };

  const asImage = (fallback: boolean) => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(src, (tex) => {
      const img = tex.image as { naturalWidth?: number; width?: number; naturalHeight?: number; height?: number };
      place(tex, img.naturalWidth ?? img.width ?? 0, img.naturalHeight ?? img.height ?? 0);
    }, undefined, () => {
      if (fallback) asVideo();
      else console.warn('[Unyson+ scene] 3D device "' + layer.id + '": the screen picture could not be loaded.');
    });
  };

  // A video by its name or type; a picture by its; anything else (a project file, a blob address) is tried as a picture, then as a video.
  if (VIDEO_RE.test(src)) asVideo();
  else asImage(!IMAGE_RE.test(src));

  return {
    sync(t, playing) {
      const v = video;
      if (!v || gone) return;
      const rate = m.rate ?? 1;
      const len = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 0;
      let want = (m.offset ?? 0) + Math.max(0, t) * rate;
      if (len) want = (m.loop ?? true) ? want % len : Math.min(want, Math.max(0, len - 0.04));
      if (playing && t >= 0 && (len === 0 || (m.loop ?? true) || want < len - 0.05)) {
        if (v.playbackRate !== rate) v.playbackRate = rate;
        if (Math.abs(v.currentTime - want) > 0.25) v.currentTime = want;
        if (v.paused) v.play().catch(() => { /* not allowed yet: stays on the frame */ });
        if (texture) texture.needsUpdate = true;
      } else {
        if (!v.paused) v.pause();
        if (Math.abs(v.currentTime - want) > 0.004) v.currentTime = want;
      }
    },
    dispose() {
      gone = true;
      texture?.dispose();
      if (video) { video.pause(); video.removeAttribute('src'); video.load(); video.remove(); }
    },
  };
}

/** The deck of a laptop: keys and a trackpad drawn once into a texture. */
function deckTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 700;
  const g = c.getContext('2d')!;
  const rr = (x: number, y: number, w: number, h: number, r: number) => { g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); };
  // The keyboard well, then the keys row by row (the last row has the space bar).
  g.fillStyle = 'rgba(12,13,16,0.92)';
  rr(70, 40, 884, 360, 18);
  g.fillStyle = '#2a2d33';
  const rows = [14, 14, 13, 12, 11];
  rows.forEach((n, i) => {
    const kw = (860 - (n - 1) * 8) / n;
    for (let k = 0; k < n; k++) rr(82 + k * (kw + 8), 52 + i * 58, kw, 50, 7);
  });
  const y = 52 + 5 * 58;
  [70, 70, 90].forEach((w, k) => rr(82 + k * 78, y, w, 50, 7));
  rr(330, y, 360, 50, 7);
  [70, 70, 90].forEach((w, k) => rr(702 + k * 78, y, w, 50, 7));
  // The trackpad.
  g.fillStyle = 'rgba(0,0,0,0.18)';
  rr(342, 436, 340, 220, 22);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface BuildContext { host: HTMLElement; redraw: () => void; aniso: number }
/** What a device needs at each frame: its screen video, and a laptop's lid. */
interface DeviceParts { screen: DeviceScreen | null; lid?: { pivot: THREE.Group; angle: number }; textures: THREE.Texture[] }

const DEVICE_COLOURS: Record<string, string> = { phone: '#2b2d32', tablet: '#2b2d32', laptop: '#b9bdc4', monitor: '#26282d' };

/** Builds a device (roughly to scale, in arbitrary units: the caller normalises it). */
function buildDevice(layer: ModelLayer, ctx: BuildContext): { obj: THREE.Group; parts: DeviceParts } {
  const m = layer.model;
  const kind = m.device ?? 'phone';
  const body = makeMaterial({ finish: 'metal', ...layer.material, color: layer.material?.color || DEVICE_COLOURS[kind] });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x050607, roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05 });
  const root = new THREE.Group();
  const parts: DeviceParts = { screen: null, textures: [] };

  if (kind === 'phone' || kind === 'tablet') {
    const phone = kind === 'phone';
    // Built upright; held sideways, the body turns a quarter and the screen content is laid out the other way round.
    const W = phone ? 0.75 : 1.5, H = phone ? 1.56 : 2.04, D = phone ? 0.085 : 0.065, R = phone ? 0.12 : 0.1;
    const bezel = phone ? 0.028 : 0.07;
    const sw = W - 2 * bezel, sh = H - 2 * bezel, sr = Math.max(0.01, R - bezel * 0.9);
    const bodyGroup = new THREE.Group();
    bodyGroup.add(new THREE.Mesh(slab(W, H, D, R), body));
    const front = new THREE.Mesh(rrPlane(W - 0.012, H - 0.012, R - 0.006), glass);
    front.position.z = D / 2 + 0.0008;
    bodyGroup.add(front);
    if (phone) {
      // A small camera pill at the top of the screen, and a camera block on the back; buttons on the sides.
      const pill = new THREE.Mesh(rrPlane(0.17, 0.05, 0.025), new THREE.MeshBasicMaterial({ color: 0x000000 }));
      pill.position.set(0, sh / 2 - 0.05, D / 2 + 0.0035);
      bodyGroup.add(pill);
      const cam = new THREE.Mesh(slab(0.3, 0.3, 0.02, 0.07, 0.006), body);
      cam.position.set(-W / 2 + 0.2, H / 2 - 0.2, -D / 2 - 0.008);
      bodyGroup.add(cam);
      for (const [x, y] of [[-0.065, 0.065], [0.065, 0.065], [-0.065, -0.065]]) {
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.02, 40), glass);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(-W / 2 + 0.2 + x, H / 2 - 0.2 + y, -D / 2 - 0.02);
        bodyGroup.add(lens);
      }
      // The power button on the right; two volume buttons on the left.
      for (const [x, y, l] of [[W / 2, 0.38, 0.17], [-W / 2, 0.4, 0.1], [-W / 2, 0.26, 0.1]]) {
        const b = new THREE.Mesh(new RoundedBoxGeometry(0.014, l, 0.032, 2, 0.006), body);
        b.position.set(x + Math.sign(x) * 0.004, y, 0);
        bodyGroup.add(b);
      }
    } else {
      const dot = new THREE.Mesh(new THREE.CircleGeometry(0.012, 24), new THREE.MeshBasicMaterial({ color: 0x15171a }));
      dot.position.set(0, H / 2 - bezel / 2, D / 2 + 0.0015);
      bodyGroup.add(dot);
    }
    if (m.landscape) bodyGroup.rotation.z = Math.PI / 2;
    root.add(bodyGroup);
    const [cw, ch] = m.landscape ? [sh, sw] : [sw, sh];
    parts.screen = makeScreen(root, layer, cw, ch, sr, D / 2 + 0.002, ctx);
  } else if (kind === 'monitor') {
    const W = 2.4, D = 0.06, bezel = 0.045;
    const sw = W - 2 * bezel, sh = (W - 2 * bezel) * 9 / 16;
    const panelH = sh + bezel * 2 + 0.06; // a slightly deeper chin
    const panel = new THREE.Group();
    panel.add(new THREE.Mesh(slab(W, panelH, D, 0.035), body));
    const front = new THREE.Mesh(rrPlane(W - 0.01, panelH - 0.01, 0.03), glass);
    front.position.z = D / 2 + 0.0008;
    panel.add(front);
    panel.position.y = 0.55;
    // The screen sits in the panel's upper part, above the chin.
    parts.screen = makeScreen(panel, layer, sw, sh, 0.008, D / 2 + 0.002, ctx, 0.03);
    root.add(panel);
    const neck = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.62, 0.05, 4, 0.02), body);
    neck.position.set(0, 0.55 - panelH / 2 - 0.2, -D / 2 - 0.03);
    root.add(neck);
    const foot = new THREE.Mesh(slab(0.85, 0.5, 0.035, 0.12), body);
    foot.rotation.x = -Math.PI / 2;
    foot.position.set(0, 0.55 - panelH / 2 - 0.5, 0.05);
    root.add(foot);
  } else {
    // Laptop: the deck lies flat, the lid turns on its hinge at the back. Seen a little from above when at rest.
    const W = 2.2, DEPTH = 1.5, T = 0.055, LT = 0.03, LH = 1.42, bezel = 0.06;
    const deck = new THREE.Mesh(slab(W, DEPTH, T, 0.07), body);
    deck.rotation.x = -Math.PI / 2;
    root.add(deck);
    const deckTex = deckTexture();
    parts.textures.push(deckTex);
    const keys = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.9, DEPTH * 0.88), new THREE.MeshStandardMaterial({ map: deckTex, transparent: true, roughness: 0.6 }));
    keys.rotation.x = -Math.PI / 2;
    keys.position.set(0, T / 2 + 0.0012, 0.02);
    root.add(keys);
    const pivot = new THREE.Group();
    pivot.position.set(0, T / 2, -DEPTH / 2 + 0.03);
    const lid = new THREE.Group();
    lid.add(new THREE.Mesh(slab(W, LH, LT, 0.07), body));
    const front = new THREE.Mesh(rrPlane(W - 0.01, LH - 0.01, 0.065), glass);
    front.position.z = LT / 2 + 0.0008;
    lid.add(front);
    const sw = W - 2 * bezel, sh = sw * 10 / 16;
    parts.screen = makeScreen(lid, layer, sw, sh, 0.01, LT / 2 + 0.002, ctx, 0.025);
    // Behind the hinge line when open, so it lands on top of the deck when it closes.
    lid.position.set(0, LH / 2 + 0.01, -LT / 2);
    pivot.add(lid);
    root.add(pivot);
    const angle = Math.max(0, Math.min(135, m.open ?? 105));
    parts.lid = { pivot, angle };
    pivot.rotation.x = (90 - angle) * DEG;
    root.rotation.x = 14 * DEG;
  }
  return { obj: root, parts };
}

/** Builds the object, centred on the origin and scaled so its largest side is 1. */
async function buildObject(layer: ModelLayer, ctx: BuildContext): Promise<THREE.Object3D> {
  const m = layer.model;
  const depth = m.depth ?? 0.3;
  const bevel = m.bevel ?? 0.4;
  let obj: THREE.Object3D;
  let device: DeviceParts | undefined;

  if (m.kind === 'device') {
    const built = buildDevice(layer, ctx);
    obj = built.obj;
    device = built.parts;
  } else if (m.kind === 'text') {
    const geo = new TextGeometry(m.text || ' ', {
      font: getFont(), size: 1, depth, curveSegments: 10,
      bevelEnabled: bevel > 0, bevelThickness: depth * bevel * 0.4, bevelSize: 0.012 + bevel * 0.035, bevelSegments: 5,
    });
    geo.computeVertexNormals();
    obj = new THREE.Mesh(geo, makeMaterial(layer.material));
  } else if (m.kind === 'shape') {
    const geos: Record<string, () => THREE.BufferGeometry> = {
      box: () => new RoundedBoxGeometry(1, 1, 1, 6, 0.1),
      sphere: () => new THREE.SphereGeometry(0.6, 96, 48),
      torus: () => new THREE.TorusGeometry(0.5, 0.2, 64, 160),
      knot: () => new THREE.TorusKnotGeometry(0.45, 0.15, 300, 40),
      cylinder: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 96),
      crystal: () => new THREE.IcosahedronGeometry(0.6, 0),
    };
    const mat = makeMaterial(layer.material);
    if (m.shape === 'crystal') mat.flatShading = true;
    obj = new THREE.Mesh((geos[m.shape ?? 'box'] ?? geos.box)(), mat);
  } else if (m.kind === 'svg') {
    const data = new SVGLoader().parse(await svgMarkup(m.src ?? ''));
    const group = new THREE.Group();
    // Extrusion depth relative to the drawing's height.
    const box = new THREE.Box2();
    data.paths.forEach((p) => p.toShapes().forEach((s) => s.getPoints().forEach((pt) => box.expandByPoint(pt))));
    const h = Math.max(1e-6, box.max.y - box.min.y);
    for (const p of data.paths) {
      const fill = (p.userData as { style?: { fill?: string } } | undefined)?.style?.fill;
      if (fill === 'none') continue;
      const mat = makeMaterial(layer.material?.color ? layer.material : { ...layer.material, color: fill && fill !== 'currentColor' ? fill : undefined });
      for (const shape of p.toShapes()) {
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: depth * h, curveSegments: 12,
          bevelEnabled: bevel > 0, bevelThickness: depth * h * bevel * 0.3, bevelSize: h * (0.004 + bevel * 0.012), bevelSegments: 4,
        });
        group.add(new THREE.Mesh(geo, mat));
      }
    }
    group.scale.y = -1; // SVG's y axis points down
    obj = group;
  } else {
    const gltf = await new GLTFLoader().loadAsync(m.src ?? '');
    obj = gltf.scene;
    // Its animations (made in Blender and the like) play on the scene's clock: see time() below.
    obj.userData.clips = gltf.animations ?? [];
    if (layer.material?.original === false) {
      const mat = makeMaterial(layer.material);
      obj.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = mat; });
    }
  }

  // Centre and normalise.
  const wrap = new THREE.Group();
  wrap.add(obj);
  const bb = new THREE.Box3().setFromObject(wrap);
  const size = bb.getSize(new THREE.Vector3());
  const center = bb.getCenter(new THREE.Vector3());
  obj.position.sub(center);
  const k = 1 / Math.max(size.x, size.y, size.z, 1e-6);
  wrap.scale.setScalar(k);
  // The animations go with the wrapper the rest of the runtime works with.
  wrap.userData.clips = obj.userData.clips ?? [];
  wrap.userData.device = device;
  return wrap;
}

function create(host: HTMLElement, layer: ModelLayer): Runtime3D {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping; // keeps brand colours true
  const canvas = renderer.domElement;
  Object.assign(canvas.style, {
    position: 'absolute', left: `${-BLEED * 100}%`, top: `${-BLEED * 100}%`,
    width: `${(1 + 2 * BLEED) * 100}%`, height: `${(1 + 2 * BLEED) * 100}%`, display: 'block', pointerEvents: 'none',
  });
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  const light = layer.light ?? 1;
  scene.environmentIntensity = light;
  const key = new THREE.DirectionalLight(0xffffff, 1.6 * light);
  key.position.set(2, 3, 4);
  scene.add(key, new THREE.HemisphereLight(0xffffff, 0x223344, 0.35 * light));

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.01, 100);
  const pivot = new THREE.Group(); // turns and moves (the state)
  const posed = new THREE.Group(); // the resting pose
  pivot.add(posed);
  scene.add(pivot);
  const pose = layer.pose ?? {};
  posed.rotation.set((pose.rx ?? 0) * DEG, (pose.ry ?? 0) * DEG, (pose.rz ?? 0) * DEG, 'YXZ');
  posed.scale.setScalar(pose.scale ?? 1);

  let last: State3D | null = null;
  let device: DeviceParts | undefined;
  let mixer: THREE.AnimationMixer | null = null;
  let clipLength = 0;
  let animAt = -1;
  let disposed = false;
  let w = 0;
  let h = 0;

  // Half the width, height and depth of the object in its resting pose (set once it is built).
  let half = new THREE.Vector3(0.5, 0.5, 0.5);

  /** Camera distance at which the resting object just fits the box (the canvas's middle part, inside the bleed). */
  function fitDistance(aspect: number) {
    const v = (FOV / 2) * DEG;
    const hv = Math.atan(Math.tan(v) * aspect);
    const k = 1 + 2 * BLEED;
    // At rest the object fills about 80% of the box, leaving room for it to turn.
    return Math.max((half.y * k) / Math.tan(v), (half.x * k) / Math.tan(hv)) * 1.25 + half.z;
  }

  function size() {
    const rw = Math.round(host.clientWidth * (1 + 2 * BLEED));
    const rh = Math.round(host.clientHeight * (1 + 2 * BLEED));
    if (!rw || !rh || (rw === w && rh === h)) return;
    w = rw;
    h = rh;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function draw(s: State3D) {
    if (disposed) return;
    size();
    if (!w || !h) return;
    pivot.rotation.set(s.rx * DEG, s.ry * DEG, s.rz * DEG, 'YXZ');
    pivot.scale.setScalar(Math.max(0.0001, s.s));
    pivot.position.set(s.px, s.py, 0);
    // A laptop's lid: its own angle, opened or closed by the Open lid preset.
    if (device?.lid) device.lid.pivot.rotation.x = (90 - device.lid.angle * Math.max(0, Math.min(1, s.open ?? 1))) * DEG;
    const d = fitDistance(camera.aspect) * Math.max(0.05, s.dolly);
    const o = s.orbit * DEG;
    const t = s.tilt * DEG;
    camera.position.set(Math.sin(o) * Math.cos(t) * d, Math.sin(t) * d, Math.cos(o) * Math.cos(t) * d);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  const ro = new ResizeObserver(() => { if (last) draw(last); });
  ro.observe(host);

  const ctx: BuildContext = { host, redraw: () => { if (last && !disposed) draw(last); }, aniso: renderer.capabilities.getMaxAnisotropy() };
  const ready = buildObject(layer, ctx).then((obj) => {
    if (disposed) { (obj.userData.device as DeviceParts | undefined)?.screen?.dispose(); return; }
    device = obj.userData.device;
    // Measure the object in its resting pose only: the pivot may be mid-animation (an entrance can have
    // it scaled down), and fitting the camera to that would leave it far too close.
    const probe = new THREE.Group();
    probe.rotation.copy(posed.rotation);
    probe.scale.copy(posed.scale);
    probe.add(obj);
    probe.updateMatrixWorld(true);
    new THREE.Box3().setFromObject(probe).getSize(half).multiplyScalar(0.5);
    posed.add(obj);
    // Animated models: every clip (or the one the layer names), set to the scene's moment by time().
    const clips: THREE.AnimationClip[] = obj.userData.clips ?? [];
    const want = layer.animation?.clip;
    const chosen = want && want !== 'all' ? clips.filter((c) => c.name === want) : clips;
    if (chosen.length) {
      mixer = new THREE.AnimationMixer(obj);
      for (const c of chosen) mixer.clipAction(c).play();
      clipLength = Math.max(...chosen.map((c) => c.duration));
      mixer.setTime(0);
    }
    if (last) draw(last);
  }).catch((e) => {
    console.warn('[Unyson+ scene] 3D layer "' + layer.id + '" could not be built:', e);
  });

  return {
    ready,
    animationLength: () => clipLength,
    time(sec, playing) {
      if (disposed) return;
      device?.screen?.sync(sec, !!playing);
      if (!mixer) { if (device?.screen && playing && last) draw(last); return; }
      const loop = layer.animation?.loop ?? true;
      const t = Math.max(0, sec) * (layer.animation?.speed ?? 1);
      const at = clipLength > 0 ? (loop ? t % clipLength : Math.min(t, clipLength - 1e-4)) : 0;
      if (Math.abs(at - animAt) < 1e-6) return;
      animAt = at;
      mixer.setTime(at);
      if (last) draw(last);
    },
    render(s) {
      last = { ...s };
      draw(last);
    },
    dispose() {
      disposed = true;
      ro.disconnect();
      device?.screen?.dispose();
      device?.textures.forEach((t) => t.dispose());
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mt) => mt.dispose());
        }
      });
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      // Give the WebGL context back too: a disposed renderer keeps it, and the page then keeps paying for it
      // (another scene mounted afterwards ran at a fraction of its speed).
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}

export const module3d: Module3D = { create };
