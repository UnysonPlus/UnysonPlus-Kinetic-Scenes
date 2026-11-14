import { mount, type ScenePlayer } from './player';

/**
 * Mounts every scene on the page that has not been mounted yet:
 *
 *   <div data-upw-scene>
 *     <script type="application/json">{ ...scene file... }</script>
 *   </div>
 *
 * or <div data-upw-scene data-upw-src="scene.json"></div> to load the scene file from an address.
 * Add data-upw-allow-code to let the scene's custom code clips run (only for scenes you trust).
 * Pictures and footage load when the scene comes within about one screen of the window; add
 * data-upw-load="page" to load them with the page instead.
 * A scene that fails to load or validate is reported in the console and left empty; it never stops
 * the rest of the page.
 */
export async function autoMount(root: ParentNode = document): Promise<ScenePlayer[]> {
  const hosts = Array.from(root.querySelectorAll<HTMLElement>('[data-upw-scene]:not([data-upw-mounted])'));
  const players: ScenePlayer[] = [];
  for (const host of hosts) {
    host.dataset.upwMounted = '';
    try {
      const inline = host.querySelector<HTMLScriptElement>('script[type="application/json"]');
      const scene = inline
        ? JSON.parse(inline.textContent || '{}')
        : await fetch(host.dataset.upwSrc || '').then((r) => {
            if (!r.ok) throw new Error(`Couldn't load the scene file (HTTP ${r.status}).`);
            return r.json();
          });
      // Custom code clips run only when the page that placed the scene says so.
      // Pictures and footage load as the scene comes near the screen, unless the host asks for them with the page.
      players.push(mount(host, scene, { allowCode: host.hasAttribute('data-upw-allow-code'), lazy: host.dataset.upwLoad !== 'page' }));
    } catch (err) {
      console.error('[Unyson+ scene]', err);
    }
  }
  return players;
}
