import { createSupabaseBrowserClient } from "./supabase-browser";

export async function getUserCredits(): Promise<number | null> {
  const supabase = createSupabaseBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  return data.credits;
}

export async function deductCredit(): Promise<{ success: boolean; remaining: number | null }> {
  const supabase = createSupabaseBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, remaining: null };

  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (fetchError || !profile) return { success: false, remaining: null };
  if (profile.credits <= 0) return { success: false, remaining: 0 };

  const { data, error } = await supabase
    .from("profiles")
    .update({ credits: profile.credits - 1 })
    .eq("id", user.id)
    .select("credits")
    .single();

  if (error || !data) return { success: false, remaining: profile.credits };
  return { success: true, remaining: data.credits };
}
