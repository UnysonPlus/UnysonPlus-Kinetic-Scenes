/**
 * A time in seconds as a clock: "0:04.50", "4:47.00", "1:02:05.25". Seconds alone ("287.00 s")
 * made a long scene hard to read; hundredths stay because timing is set to the frame.
 * `digits` is how many decimals (0 for a plain "4:47").
 */
export function clock(seconds: number, digits = 2): string {
  const neg = seconds < 0;
  const scale = 10 ** digits;
  let total = Math.round(Math.abs(seconds) * scale) / scale;
  const h = Math.floor(total / 3600);
  total -= h * 3600;
  const m = Math.floor(total / 60);
  const s = total - m * 60;
  const ss = s.toFixed(digits).padStart(digits ? digits + 3 : 2, '0');
  const body = h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
  return (neg ? '-' : '') + body;
}

/** The same time for a screen reader: "4 minutes 47 seconds". */
export function spokenClock(seconds: number): string {
  const t = Math.max(0, Math.round(seconds));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  const part = (n: number, w: string) => (n ? `${n} ${w}${n === 1 ? '' : 's'}` : '');
  return [part(h, 'hour'), part(m, 'minute'), part(s, 'second')].filter(Boolean).join(' ') || '0 seconds';
}
