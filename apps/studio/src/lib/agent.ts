import { kitBase, kitHas } from './ai';

/**
 * AI assist in steps: the request runs as an agent (Claude Code, through the AI Dev Kit) inside the open project's
 * folder. It edits scene.json, which the Studio follows live, so the Studio only shows its steps and its summary.
 */

export interface AgentJob { state: 'running' | 'done' | 'error' | 'cancelled'; steps: { t: number; text: string }[]; summary: string; error: string; seconds: number }

/** Whether the running kit can work in steps (Claude Code is on this computer). */
export const stepsAvailable = () => kitHas('agent');

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const b = await kitBase();
  if (!b) throw new Error('The AI Dev Kit is not running on this computer.');
  const r = await fetch(`${b}/studio/agent${path}`, init);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `The kit answered ${r.status}.`);
  return j as T;
}

export const startSteps = (project: string, prompt: string) =>
  call<{ id: string }>('', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project, prompt }) });
export const stepsJob = (id: string) => call<AgentJob>(`/${encodeURIComponent(id)}`);
export const cancelSteps = (id: string) => call<{ ok: boolean }>(`/${encodeURIComponent(id)}/cancel`, { method: 'POST' }).catch(() => ({ ok: false }));
