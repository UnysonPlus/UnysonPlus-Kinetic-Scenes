import { forwardRef, useEffect, useRef, useState } from 'react';
import type { Zone } from '@unysonplus/scene-player/video';

export interface Device {
  /** A screen (desktop, laptop, tablet, mobile), or a video format (9x16, 1x1, 4x5, 16x9). */
  id: string;
  label: string;
  /** Browser viewport, i.e. the screen minus tabs, address bar and system bars. */
  width: number;
  height: number;
}

export const DEVICES: Device[] = [
  { id: 'desktop', label: 'Desktop', width: 1920, height: 950 },
  { id: 'laptop', label: 'Laptop', width: 1440, height: 780 },
  { id: 'tablet', label: 'Tablet', width: 820, height: 1080 },
  { id: 'mobile', label: 'Mobile', width: 390, height: 740 },
];

/**
 * The preview: an iframe sized exactly like the chosen device's browser window, scaled down to fit.
 * Because the scene runs in a real viewport of that size, the stage's breakpoints and height modes
 * behave exactly as they will on a visitor's screen.
 */
export const Preview = forwardRef<HTMLIFrameElement, { device: Device; srcDoc: string; label: string; onScale?: (scale: number) => void; zones?: Zone[]; checker?: boolean }>(
  function Preview({ device, srcDoc, label, onScale, zones, checker }, ref) {
    const areaRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.5);

    useEffect(() => {
      const el = areaRef.current;
      if (!el) return;
      const fit = () => {
        const r = el.getBoundingClientRect();
        const pad = 32;
        setScale(Math.min(1, (r.width - pad) / device.width, (r.height - pad - 22) / device.height));
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(el);
      return () => ro.disconnect();
    }, [device.width, device.height]);

    useEffect(() => onScale?.(scale), [scale, onScale]);

    const w = Math.round(device.width * scale);
    const h = Math.round(device.height * scale);

    return (
      <div className="preview-area" ref={areaRef}>
        <div className="device" style={{ width: w }}>
          <div className="device-meta">
            <span>{device.label}</span>
            <span className="mono">{device.width} × {device.height}</span>
            <span className="mono">{Math.round(scale * 100)}%</span>
          </div>
          <div className={`device-screen${checker ? ' is-checker' : ''}`} style={{ width: w, height: h }}>
            <iframe
              ref={ref}
              title={label}
              srcDoc={srcDoc}
              sandbox="allow-scripts"
              style={{ width: device.width, height: device.height, transform: `scale(${scale})` }}
            />
            {/* Where the app covers the picture with its own buttons and captions. */}
            {zones && zones.length > 0 && (
              <div className="app-zones" aria-hidden="true">
                {zones.map((z) => (
                  <div key={`${z.label}${z.x}${z.y}`} className="app-zone" style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}><span>{z.label}</span></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
