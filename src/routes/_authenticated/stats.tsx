import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  currentStreak,
  dayKey,
  formatDuration,
  lastNDays,
  longestStreak,
  type SessionRow,
  type Skill,
} from "@/lib/tracker-utils";
import { sessionsQuery, skillsQuery } from "./dashboard";

export const Route = createFileRoute("/_authenticated/stats")({
  head: () => ({
    meta: [
      { title: "Stats & streaks — Repwise" },
      {
        name: "description",
        content: "Daily executions, practice time and streaks across all your tracked skills.",
      },
      { property: "og:title", content: "Stats & streaks — Repwise" },
      {
        property: "og:description",
        content: "Daily executions, practice time and streaks across your skills.",
      },
    ],
  }),
  component: Stats,
});

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Stats() {
  const sessions = useQuery(sessionsQuery);
  const skills = useQuery(skillsQuery);

  const rows = (sessions.data ?? []) as SessionRow[];
  const skillList = (skills.data ?? []) as Skill[];

  const days = lastNDays(30);
  const daily = days.map((key) => {
    const mine = rows.filter((r) => dayKey(r.started_at) === key);
    return {
      day: key.slice(5),
      executions: mine.reduce((a, r) => a + r.executions, 0),
      minutes: Math.round(mine.reduce((a, r) => a + r.duration_seconds, 0) / 60),
    };
  });

  const totalReps = rows.reduce((a, r) => a + r.executions, 0);
  const totalTime = rows.reduce((a, r) => a + r.duration_seconds, 0);

  const perSkill = skillList
    .map((s) => {
      const mine = rows.filter((r) => r.skill_id === s.id);
      return {
        skill: s,
        sessions: mine.length,
        executions: mine.reduce((a, r) => a + r.executions, 0),
        seconds: mine.reduce((a, r) => a + r.duration_seconds, 0),
        streak: currentStreak(mine),
      };
    })
    .sort((a, b) => b.executions - a.executions);

  const tooltipStyle = {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "0.5rem",
    color: "var(--foreground)",
    fontSize: 12,
  } as const;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Stats</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your last 30 days of practice.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Sessions" value={String(rows.length)} />
        <Stat label="Executions" value={String(totalReps)} />
        <Stat label="Time practised" value={formatDuration(totalTime)} />
        <Stat
          label="Streak"
          value={`${currentStreak(rows)}d / best ${longestStreak(rows)}d`}
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-medium">Executions per day</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--secondary)" }} />
                <Bar dataKey="executions" fill="var(--primary)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-medium">Minutes practised per day</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-medium">By skill</h2>
        {perSkill.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No skills yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {perSkill.map((p) => (
              <div key={p.skill.id} className="flex items-center gap-3 text-sm">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: p.skill.color }}
                />
                <span className="flex-1 truncate">{p.skill.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {p.sessions} sessions · {p.executions} reps · {formatDuration(p.seconds)} ·{" "}
                  {p.streak}d streak
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
