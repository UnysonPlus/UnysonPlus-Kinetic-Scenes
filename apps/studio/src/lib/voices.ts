import { useCallback, useEffect, useState } from 'react';
import { voiceStatus } from './voice';
import { preferredVoice, rememberVoice } from './addons';

/**
 * The voices a voice-over can be spoken in: the kit's three built-in voices, plus the person's Voicebox profiles while
 * Voicebox is open. One choice, shared by Voice-over from a script and AI assist (and remembered), so both always show
 * the voice that will be used.
 */

export const BUILT_IN = [
  { value: 'en_US-lessac-medium', label: 'Clear (American English)' },
  { value: 'en_US-ryan-medium', label: 'Warm (American English)' },
  { value: 'en_GB-alba-medium', label: 'Bright (British English)' },
];
const DEFAULT = BUILT_IN[0].value;
const EVENT = 'upw-voice-change';

export interface VoiceOption { value: string; label: string; missing?: boolean }

/** How a voice is named everywhere (menus, a voice track's details). */
export function voiceLabel(value: string, profiles: Array<{ id: string; name: string }> = []): string {
  const b = BUILT_IN.find((v) => v.value === value);
  if (b) return b.label;
  if (value.startsWith('voicebox:')) {
    const p = profiles.find((x) => `voicebox:${x.id}` === value);
    return p ? `Voicebox: ${p.name}` : 'Voicebox (open it to use this voice)';
  }
  return value;
}

export function useVoices() {
  const [voice, setVoiceState] = useState(() => preferredVoice() ?? DEFAULT);
  const [profiles, setProfiles] = useState<Array<{ id: string; name: string }>>([]);
  const [voicebox, setVoicebox] = useState(false);
  const refresh = useCallback(() => {
    voiceStatus().then((st) => {
      const on = !!st?.voicebox?.connected;
      setVoicebox(on);
      setProfiles(on ? st!.voicebox!.profiles : []);
    }).catch(() => { setVoicebox(false); setProfiles([]); });
  }, []);
  useEffect(refresh, [refresh]);
  // Another menu changed the voice: follow it.
  useEffect(() => {
    const on = (e: Event) => setVoiceState((e as CustomEvent<string>).detail);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  const setVoice = useCallback((v: string) => {
    setVoiceState(v);
    rememberVoice(v);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: v }));
  }, []);
  const options: VoiceOption[] = [
    ...BUILT_IN,
    ...profiles.map((p) => ({ value: `voicebox:${p.id}`, label: `Voicebox: ${p.name}` })),
    ...(voice.startsWith('voicebox:') && !profiles.some((p) => `voicebox:${p.id}` === voice) ? [{ value: voice, label: voiceLabel(voice), missing: true }] : []),
  ];
  return { voice, setVoice, options, label: voiceLabel(voice, profiles), isVoicebox: voice.startsWith('voicebox:'), voicebox, refresh };
}
