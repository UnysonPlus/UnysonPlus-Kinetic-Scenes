import { liveValue, useLive, type LiveValue } from '../lib/liveValue';
/** Stands in when no clock is given (hooks must always run). */
const STILL = liveValue(0);
import { PauseIcon, PlayIcon, RestartIcon } from './icons';

const fmt = (t: number) => t.toFixed(2);

/** Play, pause, jump to the start and scrub. */
export function Transport(props: {
  time: number;
  /** The playhead as a live value: when given, the readout and the bar follow every frame (App state is updated less often). */
  clock?: LiveValue<number>;
  duration: number;
  playing: boolean;
  disabled: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (t: number) => void;
  hasAudio?: boolean;
  soundOn?: boolean;
  /** Sound is on but the browser is waiting for a first click before it plays any. */
  soundWaiting?: boolean;
  onSound?: (on: boolean) => void;
}) {
  const { duration, playing, disabled } = props;
  const live = useLive(props.clock ?? STILL);
  const time = props.clock ? live : props.time;
  const pct = duration > 0 ? Math.min(100, (time / duration) * 100) : 0;
  return (
    <div className="transport">
      <button
        type="button"
        className="icon-btn"
        onClick={() => props.onSeek(0)}
        disabled={disabled}
        aria-label="Go to start"
        title="Go to start (Home)"
      >
        <RestartIcon />
      </button>
      <button
        type="button"
        className="icon-btn play"
        onClick={playing ? props.onPause : props.onPlay}
        disabled={disabled}
        aria-label={playing ? 'Pause' : 'Play'}
        title={`${playing ? 'Pause' : 'Play'} (Space)`}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      {props.hasAudio && (
        <button type="button" className={`icon-btn sound-btn${props.soundOn ? ' on' : ''}${props.soundWaiting ? ' waiting' : ''}`} onClick={() => props.onSound?.(!props.soundOn)}
          aria-pressed={!!props.soundOn} aria-label={props.soundOn ? 'Mute' : 'Sound on'} title={props.soundWaiting ? 'Sound is on: click anywhere to start it (browsers wait for a first click)' : props.soundOn ? 'Sound on (click to mute)' : 'Muted (click for sound)'}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" />
            {props.soundOn
              ? <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              : <path d="M16.5 9.5l5 5M21.5 9.5l-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        </button>
      )}
      <span className="time mono" aria-live="off">
        <span className="time-now">{fmt(time)}</span>
        <span className="time-sep">/</span>
        {fmt(duration)} s
      </span>
      <input
        className="scrub"
        type="range"
        min={0}
        max={duration || 1}
        step={0.01}
        value={Math.min(time, duration || 1)}
        disabled={disabled}
        onChange={(e) => props.onSeek(Number(e.target.value))}
        aria-label="Playhead"
        aria-valuetext={`${fmt(time)} of ${fmt(duration)} seconds`}
        style={{ ['--pct' as string]: `${pct}%` }}
      />
    </div>
  );
}
