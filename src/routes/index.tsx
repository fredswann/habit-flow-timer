import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Timer, ListChecks, BarChart3 } from "lucide-react";

import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Repwise — Timed Skill & Habit Tracker" },
      {
        name: "description",
        content:
          "Practice any skill on a countdown or stopwatch, log how many reps you completed, and track streaks and totals over time.",
      },
      { property: "og:title", content: "Repwise — Timed Skill & Habit Tracker" },
      {
        property: "og:description",
        content:
          "Run a timer for any skill, log your executions, and watch your totals and streaks build.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Timer,
    title: "Countdown or stopwatch",
    body: "Set a block of practice time, or free-run the clock and stop when you're done.",
  },
  {
    icon: ListChecks,
    title: "Executions per session",
    body: "When the timer ends, log how many reps you completed. Date, time and duration are saved automatically.",
  },
  {
    icon: BarChart3,
    title: "Stats and streaks",
    body: "Per-skill totals, reps per minute, a 30-day activity chart, and daily streaks.",
  },
];

function Landing() {
  const { session, loading } = useAuthSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard", replace: true });
  }, [loading, session, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-24">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Repwise</p>
        <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight">
          Time your practice. Count your reps.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          A focused tracker for deliberate practice: pick a skill, run the timer, and log exactly
          how many executions you got through in that window.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild size="lg">
            <Link to="/auth">Get started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-5">
              <f.icon className="h-5 w-5 text-accent" />
              <h2 className="mt-4 text-base font-medium">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
