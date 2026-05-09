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
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-colors"
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
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-colors"
          />
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        <p className="text-center text-xs text-white/40">
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
