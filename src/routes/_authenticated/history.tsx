import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteSession } from "@/lib/tracker.functions";
import {
  formatClock,
  formatDateTime,
  repsPerMinute,
  type SessionRow,
  type Skill,
} from "@/lib/tracker-utils";
import { sessionsQuery, skillsQuery } from "./dashboard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Session history — Repwise" },
      {
        name: "description",
        content: "Every logged practice session with date, time, timer length and executions.",
      },
      { property: "og:title", content: "Session history — Repwise" },
      {
        property: "og:description",
        content: "Every logged session with date, time, duration and executions.",
      },
    ],
  }),
  component: History,
});

function History() {
  const queryClient = useQueryClient();
  const sessions = useQuery(sessionsQuery);
  const skills = useQuery(skillsQuery);
  const [filter, setFilter] = useState("all");

  const remove = useMutation({
    mutationFn: useServerFn(deleteSession),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const skillList = (skills.data ?? []) as Skill[];
  const byId = new Map(skillList.map((s) => [s.id, s]));
  const rows = ((sessions.data ?? []) as SessionRow[])
    .filter((r) => filter === "all" || r.skill_id === filter)
    .slice()
    .sort((a, b) => b.started_at.localeCompare(a.started_at));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Date and time, timer length, and executions for every session.
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="All skills" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All skills</SelectItem>
            {skillList.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {sessions.isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">No sessions logged yet.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/dashboard">Start practising</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Skill</th>
                <th className="px-4 py-3 font-medium">Date &amp; time</th>
                <th className="px-4 py-3 font-medium">Timer</th>
                <th className="px-4 py-3 font-medium text-right">Executions</th>
                <th className="px-4 py-3 font-medium text-right">Reps/min</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const skill = byId.get(r.skill_id);
                return (
                  <tr key={r.id} className="border-t border-border align-top">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: skill?.color ?? "var(--muted-foreground)" }}
                        />
                        {skill?.name ?? "Deleted skill"}
                      </span>
                      {r.note ? (
                        <p className="mt-1 max-w-xs text-xs text-muted-foreground">{r.note}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {formatDateTime(r.started_at)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {formatClock(r.duration_seconds)}
                      <span className="ml-2 text-muted-foreground">{r.mode}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{r.executions}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
                      {repsPerMinute(r.executions, r.duration_seconds).toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        aria-label="Delete session"
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        onClick={() => remove.mutate({ data: { id: r.id } })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
