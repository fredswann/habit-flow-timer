import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Play, Archive, Trash2, Flame } from "lucide-react";
import { toast } from "sonner";

import {
  createSkill,
  deleteSkill,
  listSessions,
  listSkills,
  updateSkill,
} from "@/lib/tracker.functions";
import {
  SKILL_COLORS,
  currentStreak,
  formatDuration,
  type SessionRow,
  type Skill,
} from "@/lib/tracker-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your skills — Repwise" },
      {
        name: "description",
        content: "All the skills you're practising, with total time, reps and current streak.",
      },
      { property: "og:title", content: "Your skills — Repwise" },
      { property: "og:description", content: "Skills you're practising, with totals and streaks." },
    ],
  }),
  component: Dashboard,
});

export const skillsQuery = queryOptions({ queryKey: ["skills"], queryFn: () => listSkills() });
export const sessionsQuery = queryOptions({
  queryKey: ["sessions"],
  queryFn: () => listSessions(),
});

function Dashboard() {
  const queryClient = useQueryClient();
  const skills = useQuery(skillsQuery);
  const sessions = useQuery(sessionsQuery);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(SKILL_COLORS[0] as string);
  const [goal, setGoal] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const create = useMutation({
    mutationFn: useServerFn(createSkill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setOpen(false);
      setName("");
      setGoal("");
      toast.success("Skill added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const patch = useMutation({
    mutationFn: useServerFn(updateSkill),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: useServerFn(deleteSkill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Skill deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const allSkills = (skills.data ?? []) as Skill[];
  const rows = (sessions.data ?? []) as SessionRow[];
  const visible = allSkills.filter((s) => (showArchived ? s.archived : !s.archived));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a skill to start a timed practice session.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? "Show active" : "Show archived"}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                New skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New skill</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skill-name">Name</Label>
                  <Input
                    id="skill-name"
                    value={name}
                    placeholder="e.g. Guitar scales"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-goal">Daily execution goal (optional)</Label>
                  <Input
                    id="skill-goal"
                    type="number"
                    min={0}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Colour</Label>
                  <div className="flex gap-2">
                    {SKILL_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        aria-label={`Colour ${c}`}
                        className={`h-7 w-7 rounded-full border-2 transition-transform ${
                          color === c ? "scale-110 border-foreground" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={!name.trim() || create.isPending}
                  onClick={() =>
                    create.mutate({
                      data: {
                        name: name.trim(),
                        color,
                        daily_goal: goal.trim() === "" ? null : Number(goal),
                      },
                    })
                  }
                >
                  Add skill
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {skills.isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {showArchived ? "Nothing archived." : "No skills yet — add your first one above."}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {visible.map((skill) => {
            const mine = rows.filter((r) => r.skill_id === skill.id);
            const totalReps = mine.reduce((a, r) => a + r.executions, 0);
            const totalTime = mine.reduce((a, r) => a + r.duration_seconds, 0);
            return (
              <div key={skill.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: skill.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-medium">{skill.name}</h2>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {mine.length} sessions · {totalReps} reps · {formatDuration(totalTime)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 font-mono text-xs text-accent">
                    <Flame className="h-3.5 w-3.5" />
                    {currentStreak(mine)}
                  </span>
                </div>
                {skill.daily_goal ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Daily goal: {skill.daily_goal} executions
                  </p>
                ) : null}
                <div className="mt-5 flex items-center gap-2">
                  <Button asChild size="sm">
                    <Link to="/practice/$skillId" params={{ skillId: skill.id }}>
                      <Play className="mr-1.5 h-4 w-4" />
                      Practice
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      patch.mutate({ data: { id: skill.id, archived: !skill.archived } })
                    }
                  >
                    <Archive className="mr-1.5 h-4 w-4" />
                    {skill.archived ? "Restore" : "Archive"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (confirm(`Delete "${skill.name}" and all its sessions?`)) {
                        remove.mutate({ data: { id: skill.id } });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
