import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Timer } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/dashboard", label: "Skills" },
  { to: "/history", label: "History" },
  { to: "/stats", label: "Stats" },
] as const;

export function AppNav() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="border-b border-border/70 bg-card/40 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
          <Timer className="h-5 w-5 text-accent" />
          Repwise
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={signOut}>
          <LogOut className="mr-1.5 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </header>
  );
}
