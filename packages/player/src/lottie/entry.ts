// Entry for scene-lottie.js: the Lottie runtime (lottie-web's light SVG player, MIT), loaded by the player only for
// scenes with a Lottie layer.
import lottie from 'lottie-web/build/player/lottie_light';
import { editLottie } from '../lottieData';
import type { LottieModule } from '../lottieLayer';

const module: LottieModule = {
  create(host, data, edits) {
    const anim = lottie.loadAnimation({ container: host, renderer: 'svg', loop: false, autoplay: false, animationData: editLottie(data, edits.colours, edits.texts) as object,
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: false } });
    const ready = new Promise<void>((ok) => { if (anim.isLoaded) ok(); else anim.addEventListener('DOMLoaded', () => ok()); });
    return {
      ready,
      frames: () => anim.totalFrames,
      show: (frame) => anim.goToAndStop(frame, true),
      dispose: () => anim.destroy(),
    };
  },
};
window.UnysonPlusSceneLottie = module;
