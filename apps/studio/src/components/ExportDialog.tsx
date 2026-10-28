import { useEffect, useMemo, useRef, useState } from 'react';
import type { Scene } from '@unysonplus/scene-player/types';
import { embedCode, exportHtml, hasLottie, hasModel, lottieRuntime, threeRuntime, hasCodeClips } from '../lib/documents';
import { embedFonts } from '../lib/fonts';
import { EditorSection } from './EditorSection';
import { VideoSection } from './VideoSection';
import { ShareSection } from './ShareSection';
import { DownloadIcon } from './icons';
import { footageIds, withFootage } from '../lib/footage';

const kb = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const sizeOf = (s: string) => new Blob([s]).size;

/** Over this, an embed is heavy for pasting into a page (usually because of uploaded images). */
const HEAVY_EMBED = 300 * 1024;

/**
 * Export: a standalone page to download, or code to paste into any page. Built on the native dialog
 * element, so focus is trapped and Escape closes it without extra code.
 */
export function ExportDialog(props: {
  open: boolean;
  scene: Scene;
  fileName: string;
  project?: string | null;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [withFonts, setWithFonts] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const hasFonts = (props.scene.stage.fonts ?? []).some((f) => f.href);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) {
      setError(null);
      setCopied(false);
      d.showModal();
    } else if (!props.open && d.open) d.close();
  }, [props.open]);

  const code = useMemo(() => (props.open ? embedCode(props.scene) : ''), [props.open, props.scene]);
  const pageSize = useMemo(() => (props.open ? sizeOf(exportHtml(props.scene)) : 0), [props.open, props.scene]);
  const codeSize = sizeOf(code);

  const download = async () => {
    setBusy(true);
    setError(null);
    try {
      let html: string;
      let note = '';
      // Footage kept in this browser is written into the page.
      const scene = (await withFootage(props.scene)).scene;
      if (withFonts && hasFonts) {
        const packed = await embedFonts(scene);
        html = exportHtml(packed.scene, { fontCss: packed.css, three: hasModel(props.scene) ? await threeRuntime() : undefined, lottie: hasLottie(props.scene) ? await lottieRuntime() : undefined });
        note = ` Fonts embedded (${kb(packed.bytes)}).`;
      } else {
        html = exportHtml(scene, { three: hasModel(props.scene) ? await threeRuntime() : undefined, lottie: hasLottie(props.scene) ? await lottieRuntime() : undefined });
      }
      const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${props.fileName}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      props.onDone(`Page saved to your downloads (${kb(sizeOf(html))}).${note}`);
      props.onClose();
    } catch (err) {
      setError(`${(err as Error).message} You can still download the page with linked fonts.`);
      setWithFonts(false);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Copying was blocked by the browser. Select the code and copy it with Ctrl+C.');
    }
  };

  return (
    <dialog
      ref={ref}
      className="export"
      aria-labelledby="export-title"
      onClose={props.onClose}
      onClick={(e) => { if (e.target === ref.current) props.onClose(); }}
    >
      <div className="export-inner">
        <header className="export-head">
          <h2 id="export-title">Export</h2>
          <button type="button" className="icon-link" aria-label="Close" onClick={props.onClose}>×</button>
        </header>

        {/* A video's main export is the video. */}
        {props.scene.mode === 'video' && <VideoSection scene={props.scene} open={props.open} onDone={props.onDone} />}
        {footageIds(props.scene).length > 0 && (
          <p className="export-warn">This scene has footage. Videos and the downloaded page carry it; a share link and the embed code can't (footage is too big for them).</p>
        )}
        <ShareSection scene={props.scene} open={props.open} />

        <section className="export-opt">
          <h3>Web page</h3>
          <p>One .html file with the scene and its own copy of the player. Open it in a browser, host it, or send it.</p>
          <label className="check">
            <input type="checkbox" checked={withFonts && hasFonts} disabled={!hasFonts} onChange={(e) => setWithFonts(e.target.checked)} />
            <span>{hasFonts ? 'Embed fonts so the page works offline' : 'No web fonts to embed'}</span>
          </label>
          <div className="export-row">
            <button type="button" className="btn primary" onClick={download} disabled={busy}>
              <DownloadIcon /> {busy ? 'Packing fonts…' : 'Download page'}
            </button>
            <span className="export-meta">{kb(pageSize)}{hasModel(props.scene) ? ' plus the 3D runtime (about 790 KB)' : ''}{withFonts && hasFonts ? ' plus fonts' : ''}</span>
          </div>
        </section>

        <section className="export-opt">
          <h3>Embed code</h3>
          <p>
            Paste into any page that accepts HTML, such as a Custom HTML block in WordPress. The player loads from
            kinetic-scenes.unysonplus.com at version {__PLAYER_VERSION__}, which never changes, so the scene keeps
            playing exactly as it does now.
          </p>
          <label htmlFor="embed-code" className="sr-only">Embed code</label>
          <textarea id="embed-code" className="code export-code" readOnly value={code} onFocus={(e) => e.currentTarget.select()} />
          <div className="export-row">
            <button type="button" className="btn" onClick={copy}>{copied ? 'Copied' : 'Copy code'}</button>
            <span className="export-meta">{kb(codeSize)}</span>
          </div>
          {hasCodeClips(props.scene) && (
            <p className="export-warn">
              This scene has custom code clips, so the code turns them on (data-upw-allow-code). They run as JavaScript on
              the page they are pasted into. Only use scenes whose code you wrote or trust.
            </p>
          )}
          {codeSize > HEAVY_EMBED && (
            <p className="export-warn">
              This code is large, usually because uploaded images are stored inside it. For a lighter embed, use image
              addresses (https://…) instead of uploads.
            </p>
          )}
        </section>

        {props.scene.mode !== 'video' && <VideoSection scene={props.scene} open={props.open} onDone={props.onDone} />}
        {props.scene.mode === 'video' && <EditorSection project={props.project ?? null} onDone={props.onDone} />}

        {error && <p className="export-error" role="alert">{error}</p>}
      </div>
    </dialog>
  );
}
