"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const schema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi zorunludur.")
    .email("Geçerli bir e-posta adresi giriniz."),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (error) {
      setServerError("Şifre sıfırlama e-postası gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <AuthLayout title="E-postanızı Kontrol Edin">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <MailCheck className="w-12 h-12 text-violet-400" />
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen
            gelen kutunuzu (ve spam klasörünüzü) kontrol edin.
          </p>
          <Link
            href="/login"
            className="inline-block text-violet-400 hover:text-violet-300 text-sm transition-colors"
          >
            Giriş sayfasına dön
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Şifremi Unuttum"
      subtitle="E-posta adresinize sıfırlama bağlantısı göndereceğiz"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
        </button>

        <p className="text-center text-xs text-white/40">
          <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
            ← Giriş sayfasına dön
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
