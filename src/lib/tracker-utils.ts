export type Skill = {
  id: string;
  name: string;
  color: string;
  daily_goal: number | null;
  archived: boolean;
  created_at: string;
};

export type SessionRow = {
  id: string;
  skill_id: string;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  mode: string;
  target_seconds: number | null;
  executions: number;
  note: string | null;
};

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  if (s < 60) return `${s}s`;
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function dayKey(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function repsPerMinute(executions: number, seconds: number): number {
  if (seconds <= 0) return 0;
  return (executions / seconds) * 60;
}

/** Consecutive calendar days ending today (or yesterday) with at least one session. */
export function currentStreak(sessions: { started_at: string }[]): number {
  const days = new Set(sessions.map((s) => dayKey(s.started_at)));
  if (days.size === 0) return 0;
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function longestStreak(sessions: { started_at: string }[]): number {
  const days = [...new Set(sessions.map((s) => dayKey(s.started_at)))].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const key of days) {
    const parts = key.split("-").map(Number);
    const d = new Date(parts[0] as number, (parts[1] as number) - 1, parts[2] as number);
    if (prev && Math.round((d.getTime() - prev.getTime()) / 86400000) === 1) {
      run += 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export function lastNDays(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const c = new Date(d);
    c.setDate(d.getDate() - i);
    out.push(dayKey(c));
  }
  return out;
}

export const SKILL_COLORS = [
  "#f0a35e",
  "#7fd1a6",
  "#7fa8f0",
  "#d78ff0",
  "#f07f8f",
  "#e3d97f",
];
