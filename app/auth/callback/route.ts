import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const type = searchParams.get("type");
      // Password reset → yeni şifre belirleme sayfası
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      // E-posta doğrulama → giriş sayfası (next parametresi verilmişse ona git)
      const redirectTo = next !== "/" ? next : "/login?verified=1";
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // Something went wrong — redirect to error page or login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
