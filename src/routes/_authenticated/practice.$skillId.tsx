import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Pause, Play, Square } from "lucide-react";
import { toast } from "sonner";

import { createSession } from "@/lib/tracker.functions";
import { formatClock, type Skill } from "@/lib/tracker-utils";
import { skillsQuery } from "./dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/practice/$skillId")({
  head: () => ({
    meta: [
      { title: "Practice session — Repwise" },
      {
        name: "description",
        content: "Run a countdown or stopwatch for this skill and log the executions you complete.",
      },
      { property: "og:title", content: "Practice session — Repwise" },
      { property: "og:description", content: "Run the timer and log your executions." },
    ],
  }),
  component: Practice,
});

const PRESETS = [5, 10, 20, 30];

function beep() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  } catch {
    /* audio unavailable */
  }
}

function Practice() {
  const { skillId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const skills = useQuery(skillsQuery);
  const skill = ((skills.data ?? []) as Skill[]).find((s) => s.id === skillId);

  const [mode, setMode] = useState<"countdown" | "stopwatch">("countdown");
  const [targetMinutes, setTargetMinutes] = useState(20);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const accumulated = useRef(0);
  const lastTick = useRef<number | null>(null);

  const [logOpen, setLogOpen] = useState(false);
  const [pending, setPending] = useState<{ start: Date; end: Date; seconds: number } | null>(null);
  const [executions, setExecutions] = useState("");
  const [note, setNote] = useState("");

  const targetSeconds = targetMinutes * 60;

  const finish = useCallback(
    (seconds: number) => {
      setRunning(false);
      lastTick.current = null;
      const start = startedAt ?? new Date(Date.now() - seconds * 1000);
      setPending({ start, end: new Date(), seconds });
      setLogOpen(true);
    },
    [startedAt],
  );

  useEffect(() => {
    if (!running) return;
    lastTick.current = Date.now();
    const id = window.setInterval(() => {
      const now = Date.now();
      accumulated.current += (now - (lastTick.current ?? now)) / 1000;
      lastTick.current = now;
      const secs = Math.floor(accumulated.current);
      setElapsed(secs);
      if (mode === "countdown" && secs >= targetSeconds) {
        beep();
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Time's up", { body: "Log your executions in Repwise." });
        }
        finish(targetSeconds);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [running, mode, targetSeconds, finish]);

  const save = useMutation({
    mutationFn: useServerFn(createSession),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session logged");
      setLogOpen(false);
      setPending(null);
      setExecutions("");
      setNote("");
      accumulated.current = 0;
      setElapsed(0);
      setStartedAt(null);
      navigate({ to: "/history" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function start() {
    if (!startedAt) setStartedAt(new Date());
    if ("Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }
    setRunning(true);
  }

  function discard() {
    setLogOpen(false);
    setPending(null);
    accumulated.current = 0;
    setElapsed(0);
    setStartedAt(null);
    setExecutions("");
    setNote("");
  }

  const display = mode === "countdown" ? Math.max(0, targetSeconds - elapsed) : elapsed;
  const progress = mode === "countdown" ? Math.min(1, elapsed / targetSeconds) : 0;

  if (skills.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!skill)
    return (
      <div>
        <p className="text-sm text-muted-foreground">That skill no longer exists.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/dashboard">Back to skills</Link>
        </Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-xl">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Skills
      </Link>

      <div className="mt-5 flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: skill.color }} />
        <h1 className="text-2xl font-semibold tracking-tight">{skill.name}</h1>
      </div>

      <Tabs
        value={mode}
        onValueChange={(v) => {
          if (running) return;
          setMode(v as "countdown" | "stopwatch");
          accumulated.current = 0;
          setElapsed(0);
        }}
        className="mt-6"
      >
        <TabsList>
          <TabsTrigger value="countdown" disabled={running}>
            Countdown
          </TabsTrigger>
          <TabsTrigger value="stopwatch" disabled={running}>
            Stopwatch
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "countdown" && !running && elapsed === 0 ? (
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="minutes">Minutes</Label>
            <Input
              id="minutes"
              type="number"
              min={1}
              max={600}
              className="w-28"
              value={targetMinutes}
              onChange={(e) => setTargetMinutes(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
          <div className="flex gap-2 pb-0.5">
            {PRESETS.map((m) => (
              <Button key={m} variant="outline" size="sm" onClick={() => setTargetMinutes(m)}>
                {m}m
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center">
        <div
          className="font-mono text-7xl font-semibold tabular-nums tracking-tight"
          style={{ color: running ? skill.color : undefined }}
        >
          {formatClock(display)}
        </div>
        {mode === "countdown" ? (
          <div className="mx-auto mt-6 h-1 w-full max-w-sm overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full transition-[width] duration-200"
              style={{ width: `${progress * 100}%`, backgroundColor: skill.color }}
            />
          </div>
        ) : null}

        <div className="mt-8 flex justify-center gap-3">
          {running ? (
            <Button size="lg" variant="outline" onClick={() => setRunning(false)}>
              <Pause className="mr-1.5 h-4 w-4" />
              Pause
            </Button>
          ) : (
            <Button size="lg" onClick={start}>
              <Play className="mr-1.5 h-4 w-4" />
              {elapsed > 0 ? "Resume" : "Start"}
            </Button>
          )}
          <Button
            size="lg"
            variant="secondary"
            disabled={elapsed === 0 && !running}
            onClick={() => finish(Math.floor(accumulated.current))}
          >
            <Square className="mr-1.5 h-4 w-4" />
            Stop & log
          </Button>
        </div>
      </div>

      <Dialog open={logOpen} onOpenChange={(o) => (o ? setLogOpen(true) : discard())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How many executions did you complete?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {pending ? formatClock(pending.seconds) : "00:00"} of {skill.name}
            {pending && pending.seconds < 5 ? " — that was a very short session." : ""}
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="executions">Executions</Label>
              <Input
                id="executions"
                type="number"
                min={0}
                autoFocus
                value={executions}
                onChange={(e) => setExecutions(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={discard}>
              Discard
            </Button>
            <Button
              disabled={executions.trim() === "" || Number(executions) < 0 || save.isPending}
              onClick={() => {
                if (!pending) return;
                save.mutate({
                  data: {
                    skill_id: skill.id,
                    started_at: pending.start.toISOString(),
                    ended_at: pending.end.toISOString(),
                    duration_seconds: pending.seconds,
                    mode,
                    target_seconds: mode === "countdown" ? targetSeconds : null,
                    executions: Math.floor(Number(executions)),
                    note: note.trim() === "" ? null : note.trim(),
                  },
                });
              }}
            >
              Save session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
