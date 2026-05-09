"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const schema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi zorunludur.")
    .email("Geçerli bir e-posta adresi giriniz."),
  password: z.string().min(1, "Şifre zorunludur."),
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");
  const isVerified = searchParams.get("verified") === "1";
  const [serverError, setServerError] = useState<string | null>(
    callbackError === "auth_callback_error"
      ? "Doğrulama bağlantısı geçersiz veya süresi dolmuş. Lütfen tekrar deneyin."
      : null
  );
  const supabase = createSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      if (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("invalid_credentials")
      ) {
        setServerError("E-posta adresi veya şifre hatalı. Lütfen kontrol edin.");
      } else if (error.message.includes("Email not confirmed")) {
        setServerError("E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuzu kontrol edin.");
      } else {
        setServerError("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <AuthLayout title="Giriş Yap" subtitle="Hesabınıza erişin">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {isVerified && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-400">
            E-posta adresiniz başarıyla doğrulandı. Şimdi giriş yapabilirsiniz.
          </div>
        )}
        {serverError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
            {serverError}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-white/70">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="ornek@mail.com"
            {...register("email")}
            className="w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(139,92,246,0.45)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.09)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-white/70">
              Şifre
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Şifremi unuttum
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
            className="w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(139,92,246,0.45)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.09)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 text-white font-medium rounded-xl px-4 py-2.5 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            boxShadow: "0 0 20px rgba(139,92,246,0.28), 0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
            Kayıt olun
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
