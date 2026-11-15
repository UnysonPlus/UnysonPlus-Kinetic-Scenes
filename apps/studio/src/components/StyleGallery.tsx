import { useEffect, useMemo, useRef, useState } from 'react';
import { mount, type ScenePlayer } from '@unysonplus/scene-player';
import { starterScene, type SceneStyle } from '../lib/styles';
import { stylePreview } from '../lib/stylePreviews';

const calm = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const posterOf = (s: SceneStyle) => (s.custom ? null : `${import.meta.env.BASE_URL}styles/${s.id}.jpg`);

/** The live scene, mounted only while it is wanted: thirty players at once would stall the dialog. */
export function Live({ style }: { style: SceneStyle }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const scene = useMemo(() => {
    const s = stylePreview(style) ?? starterScene(style);
    return { ...s, stage: { ...s.stage, breakpoints: [s.stage.breakpoints[0]], heightMode: 'ratio' as const } };
  }, [style]);
  useEffect(() => {
    if (!ref.current) return;
    let player: ScenePlayer | null = null;
    try {
      player = mount(ref.current, scene, { editor: true, autoplay: false, audio: false });
      player.seek(0);
      player.play();
      setShown(true);
    } catch { /* The photo stays. */ }
    return () => { player?.destroy(); };
  }, [scene]);
  return <div ref={ref} className={`gallery-live${shown ? ' on' : ''}`} aria-hidden="true" />;
}

/** A style's photo (or its colours, for your own), and the style itself playing on top when `playing`. */
export function StyleFrame({ style, playing }: { style: SceneStyle; playing: boolean }) {
  const poster = posterOf(style);
  return (
    <span className="gallery-frame" style={poster ? undefined : { background: style.palette.background }}>
      {poster
        ? <img src={poster} alt="" loading="lazy" decoding="async" width={320} height={180} />
        : <span className="gallery-swatch" aria-hidden="true" style={{ color: style.palette.text, fontFamily: style.fonts.heading }}>Aa</span>}
      {playing && <Live style={style} />}
    </span>
  );
}

/** Plays while hovered or focused, after a short wait so sweeping the pointer across the grid starts nothing. */
export function useHover() {
  const [hot, setHot] = useState(false);
  const wait = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = () => { if (!calm()) wait.current = setTimeout(() => setHot(true), 120); };
  const stop = () => { if (wait.current) clearTimeout(wait.current); setHot(false); };
  useEffect(() => stop, []);
  return { hot, on: { onPointerEnter: start, onPointerLeave: stop, onFocus: start, onBlur: stop } };
}

export function Tile({ style, onPick, selected }: { style: SceneStyle; onPick: (s: SceneStyle) => void; selected?: boolean }) {
  const { hot, on } = useHover();
  return (
    <li>
      <button type="button" className={`gallery-tile${selected ? ' selected' : ''}`} title={style.description} aria-pressed={selected === undefined ? undefined : selected}
        onClick={() => onPick(style)} {...on}>
        <StyleFrame style={style} playing={hot} />
        <span className="gallery-name">{style.name}</span>
      </button>
    </li>
  );
}

/** The start screen's styles: a few to start from, and the way into the whole library. */
export function StyleGallery(props: { styles: SceneStyle[]; total: number; onPick: (s: SceneStyle) => void; onAll: () => void }) {
  return (
    <section className="start-group gallery" aria-labelledby="gallery-title">
      <div className="gallery-head">
        <h3 id="gallery-title">Start from a style</h3>
        <button type="button" className="link-btn" onClick={props.onAll}>Browse all {props.total} styles <span aria-hidden="true">→</span></button>
      </div>
      <ul className="gallery-grid">
        {props.styles.map((s) => <Tile key={s.id} style={s} onPick={props.onPick} />)}
        <li>
          <button type="button" className="gallery-tile gallery-all" onClick={props.onAll}>
            <span className="gallery-frame gallery-all-frame">
              <strong>{props.total}</strong>
              <span>styles</span>
            </span>
            <span className="gallery-name">See all styles</span>
          </button>
        </li>
      </ul>
    </section>
  );
}
