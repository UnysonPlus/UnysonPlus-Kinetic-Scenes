import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { ModelLayer, ModelMaterial } from '../types';
import type { Module3D, Runtime3D, State3D } from '../model3d';
import fontJson from './font-inter-800.json';

/**
 * The 3D runtime: one small three.js scene per 3D layer. Draws only when asked (render(state)), so it
 * costs nothing while the scene is still, and every frame depends only on the state it is given.
 */

const DEG = Math.PI / 180;
const FOV = 22;
/** The canvas reaches this far past the layer's box on each side (a fraction of the box), so an object that turns or orbits isn't cut off at the box edge. */
const BLEED = 0.35;
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

/** Builds the object, centred on the origin and scaled so its largest side is 1. */
async function buildObject(layer: ModelLayer): Promise<THREE.Object3D> {
  const m = layer.model;
  const depth = m.depth ?? 0.3;
  const bevel = m.bevel ?? 0.4;
  let obj: THREE.Object3D;

  if (m.kind === 'text') {
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
    const d = fitDistance(camera.aspect) * Math.max(0.05, s.dolly);
    const o = s.orbit * DEG;
    const t = s.tilt * DEG;
    camera.position.set(Math.sin(o) * Math.cos(t) * d, Math.sin(t) * d, Math.cos(o) * Math.cos(t) * d);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  const ro = new ResizeObserver(() => { if (last) draw(last); });
  ro.observe(host);

  const ready = buildObject(layer).then((obj) => {
    if (disposed) return;
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
    time(sec) {
      if (!mixer || disposed) return;
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
      canvas.remove();
    },
  };
}

export const module3d: Module3D = { create };
