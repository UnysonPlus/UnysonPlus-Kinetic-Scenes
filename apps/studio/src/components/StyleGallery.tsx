import { useEffect, useMemo, useRef, useState } from 'react';
import { mount, type ScenePlayer } from '@unysonplus/scene-player';
import { starterScene, type SceneStyle } from '../lib/styles';
import { STYLE_GROUPS, stylePreview } from '../lib/stylePreviews';

const calm = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const posterOf = (s: SceneStyle) => (s.custom ? null : `${import.meta.env.BASE_URL}styles/${s.id}.jpg`);

/** The live scene, mounted only while it is wanted: thirty players at once would stall the dialog. */
function Live({ style }: { style: SceneStyle }) {
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

function Tile({ style, onPick }: { style: SceneStyle; onPick: (s: SceneStyle) => void }) {
  const [hot, setHot] = useState(false);
  const wait = useRef<ReturnType<typeof setTimeout> | null>(null);
  // A short wait, so sweeping the pointer across the grid starts nothing.
  const start = () => { if (!calm()) wait.current = setTimeout(() => setHot(true), 120); };
  const stop = () => { if (wait.current) clearTimeout(wait.current); setHot(false); };
  useEffect(() => stop, []);
  const poster = posterOf(style);
  return (
    <li>
      <button type="button" className="gallery-tile" title={style.description} onClick={() => onPick(style)}
        onPointerEnter={start} onPointerLeave={stop} onFocus={start} onBlur={stop}>
        <span className="gallery-frame" style={poster ? undefined : { background: style.palette.background }}>
          {poster
            ? <img src={poster} alt="" loading="lazy" decoding="async" width={320} height={180} />
            : <span className="gallery-swatch" aria-hidden="true" style={{ color: style.palette.text, fontFamily: style.fonts.heading }}>Aa</span>}
          {hot && <Live style={style} />}
        </span>
        <span className="gallery-name">{style.name}</span>
      </button>
    </li>
  );
}

/** Every style, as a photo that plays on hover. Picking one starts something in it. */
export function StyleGallery(props: { styles: SceneStyle[]; onPick: (s: SceneStyle) => void }) {
  const [group, setGroup] = useState('all');
  const yours = props.styles.filter((s) => s.custom);
  const groups = [...STYLE_GROUPS.map((g) => ({ id: g.id, label: g.label })), ...(yours.length ? [{ id: 'yours', label: 'Yours' }] : [])];
  const list = useMemo(() => {
    const by = new Map(props.styles.map((s) => [s.id, s]));
    const pick = (ids: string[]) => ids.map((id) => by.get(id)).filter((s): s is SceneStyle => !!s);
    if (group === 'yours') return yours;
    const g = STYLE_GROUPS.find((x) => x.id === group);
    if (g) return pick(g.styles);
    const ordered = pick(STYLE_GROUPS.flatMap((x) => x.styles));
    return [...ordered, ...props.styles.filter((s) => !ordered.includes(s))];
  }, [group, props.styles, yours]);
  return (
    <section className="start-group gallery" aria-labelledby="gallery-title">
      <h3 id="gallery-title">Start from a style</h3>
      <div className="gallery-filters" role="group" aria-label="Show styles">
        {[{ id: 'all', label: `All ${props.styles.length}` }, ...groups].map((g) => (
          <button key={g.id} type="button" className={group === g.id ? 'on' : ''} aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>{g.label}</button>
        ))}
      </div>
      <ul className="gallery-grid">
        {list.map((s) => <Tile key={s.id} style={s} onPick={props.onPick} />)}
      </ul>
    </section>
  );
}

