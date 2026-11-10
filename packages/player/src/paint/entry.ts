// Entry for scene-paint.js: the paint engine (p5.brush's standalone build, MIT, (c) Alejandro Campos Uribe), loaded by
// the player only for scenes that use the Painted look. One shared WebGL canvas paints every job and the result is
// copied into the layer's own 2D canvas, so a scene with many painted shapes still uses a single WebGL context.
import * as brush from 'p5.brush/standalone';
import type { PaintModule } from '../paintLayer';

let gl: HTMLCanvasElement | null = null;
let primed = false;

/** Brush names for each medium (p5.brush's own set). */
const MEDIUM: Record<string, string> = { pencil: '2B', ink: 'pen', fineliner: 'rotring', marker: 'marker', charcoal: 'charcoal', crayon: 'crayon', pastel: 'pastel', 'coloured pencil': 'cpencil' };

const module: PaintModule = {
  paint(job, target) {
    const doc = target.ownerDocument;
    if (!gl) {
      gl = doc.createElement('canvas');
      // p5.brush leaves see-through pixels white at zero opacity. Read as premultiplied (the default) those show as
      // white wherever the painting is copied, so the context is made first, unpremultiplied, and p5.brush reuses it.
      gl.getContext('webgl2', { premultipliedAlpha: false, preserveDrawingBuffer: true, alpha: true, antialias: true });
    }
    const W = Math.max(2, Math.round(job.width)), H = Math.max(2, Math.round(job.height));
    gl.width = W;
    gl.height = H;
    brush.load(gl);
    if (!primed) { brush.angleMode(brush.DEGREES); primed = true; }
    // The same seed every time: the same job paints the same pixels on every play and export.
    brush.seed(job.seed);
    brush.noiseSeed(job.seed);
    brush.clear();
    brush.push();
    brush.translate(-W / 2, -H / 2);
    const pts = job.points;
    const k = job.scale;
    brush.noStroke(); brush.noHatch(); brush.noFill(); brush.noWash();
    if (job.part !== 'line' && job.fill !== 'none' && pts.length > 2) {
      if (job.fill === 'watercolour') {
        brush.fill(job.fillColor, Math.round(255 * job.opacity * 0.7));
        brush.fillBleed(job.bleed, 'out');
        brush.fillTexture(job.texture, 0.45);
      } else if (job.fill === 'wash') {
        brush.wash(job.fillColor, Math.round(255 * job.opacity));
      } else if (job.fill === 'hatch') {
        brush.hatch(job.gap * k, job.angle, { rand: 0.08, continuous: true });
        brush.hatchStyle(MEDIUM[job.medium] ?? '2B', job.fillColor, job.weight * k);
      }
      brush.beginShape(0);
      for (const [x, y] of pts) brush.vertex(x, y);
      brush.endShape(true);
      brush.noFill(); brush.noHatch(); brush.noWash();
    }
    if (job.part !== 'fill' && job.line && pts.length > 1 && job.progress > 0) {
      brush.set(MEDIUM[job.medium] ?? '2B', job.lineColor, job.weight * k);
      // The outline, as far round as the progress has drawn it (a closed shape comes back to where it began).
      const loop = job.closed ? [...pts, pts[0]] : pts;
      const total = loop.length - 1;
      const reach = job.progress * total;
      const whole = Math.floor(reach);
      const path = loop.slice(0, whole + 1);
      if (whole < total) {
        const [ax, ay] = loop[whole], [bx, by] = loop[whole + 1];
        const f = reach - whole;
        path.push([ax + (bx - ax) * f, ay + (by - ay) * f]);
      }
      if (path.length > 1) {
        brush.beginShape(job.curve);
        for (const [x, y] of path) brush.vertex(x, y);
        brush.endShape(false);
      }
    }
    brush.pop();
    brush.render();
    target.width = W;
    target.height = H;
    const ctx = target.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(gl, 0, 0);
      // p5.brush paints as if on white paper: a wash comes out as opaque paint-on-white. Over a scene that paper would
      // show, so the white is taken back out of every pixel: the whiter it is, the more see-through, keeping only the
      // pigment. Paint then lies on whatever is below it the way watercolour lies on coloured paper.
      const img = ctx.getImageData(0, 0, W, H);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const a0 = d[i + 3];
        if (a0 === 0) continue;
        const lo = Math.min(d[i], d[i + 1], d[i + 2]);
        const a = 255 - lo;
        if (a <= 0) { d[i + 3] = 0; continue; }
        const k = 255 / a;
        d[i] = Math.min(255, (d[i] - lo) * k);
        d[i + 1] = Math.min(255, (d[i + 1] - lo) * k);
        d[i + 2] = Math.min(255, (d[i + 2] - lo) * k);
        d[i + 3] = Math.round((a * a0) / 255);
      }
      ctx.putImageData(img, 0, 0);
    }
  },
};
window.UnysonPlusScenePaint = module;
