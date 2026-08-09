import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const skillInput = z.object({
  name: z.string().trim().min(1).max(80),
  color: z.string().trim().regex(/^#[0-9a-fA-F]{3,8}$/, "color must be a hex value like #7c9cff"),
  daily_goal: z.number().int().min(0).max(100000).nullable(),
});

export const listSkills = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("skills")
      .select("id, name, color, daily_goal, archived, created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createSkill = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => skillInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("skills")
      .insert({ ...data, user_id: context.userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateSkill = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    skillInput.partial().extend({ id: z.string().uuid(), archived: z.boolean().optional() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const patch: {
      name?: string;
      color?: string;
      daily_goal?: number | null;
      archived?: boolean;
    } = {};
    if (data.name !== undefined) patch.name = data.name;
    if (data.color !== undefined) patch.color = data.color;
    if (data.daily_goal !== undefined) patch.daily_goal = data.daily_goal;
    if (data.archived !== undefined) patch.archived = data.archived;
    const { error } = await context.supabase.from("skills").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSkill = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("skills").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listSessions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("sessions")
      .select(
        "id, skill_id, started_at, ended_at, duration_seconds, mode, target_seconds, executions, note",
      )
      .order("started_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        skill_id: z.string().uuid(),
        started_at: z.string(),
        ended_at: z.string(),
        duration_seconds: z.number().int().min(0).max(60 * 60 * 24),
        mode: z.enum(["countdown", "stopwatch"]),
        target_seconds: z.number().int().min(0).max(60 * 60 * 24).nullable(),
        executions: z.number().int().min(0).max(1000000),
        note: z.string().trim().max(500).nullable(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("sessions")
      .insert({ ...data, user_id: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("sessions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
