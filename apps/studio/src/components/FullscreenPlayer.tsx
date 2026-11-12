import { useEffect, useRef, useState } from 'react';
import { mount, type ScenePlayer } from '@unysonplus/scene-player';
import type { Scene } from '@unysonplus/scene-player/types';
import { PauseIcon, PlayIcon, ResetIcon } from './icons';

/**
 * The scene played full screen, at the screen's real size and without the editor: how it looks on a
 * visitor's display. Controls fade away while it plays and come back when the mouse moves.
 * Esc (or the browser's own exit) closes it.
 */
export function FullscreenPlayer(props: { scene: Scene; startAt: number; onClose: () => void; frame?: { width: number; height: number } }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ScenePlayer | null>(null);
  const [playing, setPlaying] = useState(true);
  const [idle, setIdle] = useState(false);
  const [time, setTime] = useState(0);
  // A video keeps its format's shape (a 9:16 reel stays 9:16, as tall as the screen): it plays at the format's
  // real pixel size, as it is exported, scaled to fit the screen with black bars at the sides or top and bottom.
  const frame = props.frame;
  const fitScale = () => (frame ? Math.min(window.innerWidth / frame.width, window.innerHeight / frame.height) : 1);
  const [scale, setScale] = useState(fitScale);
  useEffect(() => {
    if (!frame) return;
    const fit = () => setScale(fitScale());
    window.addEventListener('resize', fit);
    document.addEventListener('fullscreenchange', fit);
    return () => { window.removeEventListener('resize', fit); document.removeEventListener('fullscreenchange', fit); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame?.width, frame?.height]);

  useEffect(() => {
    const wrap = wrapRef.current!;
    // A scroll-linked scene has nothing to scroll here, so it plays on its clock; triggers are ignored.
    const scene: Scene = { ...props.scene, playback: { ...props.scene.playback, trigger: 'manual' } };
    let player: ScenePlayer | null = null;
    try {
      // present: in a click-to-advance scene, clicks and the keys move through the slides.
      player = mount(hostRef.current!, scene, { autoplay: false, editor: true, present: true, soundOn: true });
      playerRef.current = player;
      player.seek(props.startAt);
      player.play();
      const offs = [
        player.on('play', () => setPlaying(true)),
        player.on('pause', () => setPlaying(false)),
        player.on('update', () => setTime(player!.time)),
      ];
      wrap.focus();
      wrap.requestFullscreen?.().catch(() => { /* Not allowed: it still fills the window. */ });
      const onChange = () => { if (!document.fullscreenElement) props.onClose(); };
      document.addEventListener('fullscreenchange', onChange);
      return () => {
        offs.forEach((off) => off());
        document.removeEventListener('fullscreenchange', onChange);
        player?.destroy();
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      };
    } catch {
      props.onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hide the controls and cursor after a moment without the mouse moving.
  useEffect(() => {
    let t = window.setTimeout(() => setIdle(true), 1800);
    const wake = () => { setIdle(false); window.clearTimeout(t); t = window.setTimeout(() => setIdle(true), 1800); };
    window.addEventListener('pointermove', wake);
    return () => { window.clearTimeout(t); window.removeEventListener('pointermove', wake); };
  }, []);

  const toggle = () => { const p = playerRef.current; if (!p) return; if (p.playing) p.pause(); else p.play(); };
  const restart = () => { const p = playerRef.current; if (!p) return; p.seek(0); p.play(); };

  return (
    <div ref={wrapRef} className={`fs-player${idle && playing ? ' is-idle' : ''}`} role="dialog" aria-label="Full screen preview"
      onKeyDown={(e) => {
        if (e.key === 'Escape') { e.stopPropagation(); props.onClose(); }
        // In a presentation, Space moves to the next slide (the player handles it); otherwise it plays and pauses.
        if (e.key === ' ' && props.scene.playback.advance !== 'click') { e.preventDefault(); e.stopPropagation(); toggle(); }
      }}
      tabIndex={-1}>
      {frame ? (
        <div className="fs-frame" style={{ width: frame.width * scale, height: frame.height * scale }}>
          <div ref={hostRef} className="fs-host" style={{ width: frame.width, height: frame.height, transform: `scale(${scale})`, transformOrigin: '0 0' }} />
        </div>
      ) : (
        <div className="fs-stage"><div ref={hostRef} className="fs-host" /></div>
      )}
      <div className="fs-controls">
        <button type="button" className="icon-btn" onClick={restart} aria-label="Restart" title="Restart"><ResetIcon /></button>
        <button type="button" className="icon-btn" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} title={playing ? 'Pause (Space)' : 'Play (Space)'}>{playing ? <PauseIcon /> : <PlayIcon />}</button>
        <span className="fs-time mono">{time.toFixed(1)} / {props.scene.duration.toFixed(1)} s</span>
        <button type="button" className="btn small" onClick={props.onClose}>Exit full screen</button>
      </div>
    </div>
  );
}
