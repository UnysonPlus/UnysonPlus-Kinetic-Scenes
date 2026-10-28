/**
 * Three directions first: before a new scene is planned, the AI proposes three distinct directions (mood, pace, look,
 * a palette, a font and the opening frame); the person picks one and the scene is built in it.
 */

export interface Direction { name: string; mood: string; pace: string; look: string; colours: string[]; font: string; opening: string }

/** What the AI is asked for (through the plan request, so any kit that plans can answer it). */
export const DIRECTIONS_ASK = `Before any plan: propose THREE clearly different creative directions for this scene. Differ in mood, pace and look,
not just in colour. Write the "plan" as exactly three blocks, each in this form and nothing else:

DIRECTION 1: <a short name>
Mood: <a few words>
Pace: <calm, steady, brisk or punchy, with the rhythm in a few words>
Look: <type, layout and motion in one sentence>
Colours: <three or four hex colours, background first>
Font: <one Google font family>
Opening: <the first frame, in one sentence>`;

/** The three directions from the AI's answer (blocks it could not read are skipped). */
export function parseDirections(text: string): Direction[] {
  const blocks = text.split(/^\s*DIRECTION\s+\d+\s*[:.-]\s*/im).slice(1);
  const field = (b: string, k: string) => (new RegExp(`^\\s*${k}\\s*:\\s*(.+)$`, 'im').exec(b)?.[1] ?? '').trim();
  return blocks.map((b) => {
    const name = b.split('\n')[0].trim().replace(/^["*]+|["*]+$/g, '');
    const colours = (field(b, 'Colou?rs').match(/#[0-9a-f]{3,8}\b/gi) ?? []).slice(0, 4);
    return { name, mood: field(b, 'Mood'), pace: field(b, 'Pace'), look: field(b, 'Look'), colours, font: field(b, 'Font').replace(/["']/g, ''), opening: field(b, 'Opening') };
  }).filter((d) => d.name && (d.mood || d.look)).slice(0, 3);
}

/** The chosen direction, as words the plan and the build follow. */
export function directionBrief(d: Direction): string {
  return `THE CHOSEN DIRECTION (follow it): "${d.name}". Mood: ${d.mood}. Pace: ${d.pace}. Look: ${d.look}. Colours: ${d.colours.join(', ')} (the first is the background). Font: ${d.font}. Opening frame: ${d.opening}`;
}
