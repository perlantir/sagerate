import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { user: { email: "demo-admin@proloanmatch.local" }, mode: "demo" as const };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  return { user, mode: "supabase" as const };
}
