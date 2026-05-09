"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const schema = z
  .object({
    fullName: z
      .string()
      .min(2, "Ad Soyad en az 2 karakter olmalıdır.")
      .max(100, "Ad Soyad en fazla 100 karakter olabilir."),
    email: z
      .string()
      .min(1, "E-posta adresi zorunludur.")
      .email("Geçerli bir e-posta adresi giriniz."),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır.")
      .regex(/[A-Z]/, "Şifre en az bir büyük harf içermelidir.")
      .regex(/[0-9]/, "Şifre en az bir rakam içermelidir."),
    confirmPassword: z.string().min(1, "Şifre onayı zorunludur."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: values.fullName,
          display_name: values.fullName,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setServerError("Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.");
      } else {
        setServerError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <AuthLayout title="E-postanızı Doğrulayın">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-12 h-12 text-violet-400" />
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Kayıt işleminiz başarılı! E-posta adresinize bir doğrulama bağlantısı
            gönderdik. Hesabınızı aktifleştirmek için lütfen e-postanızı kontrol edin.
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
      title="Hesap Oluştur"
      subtitle="InstantAPI'ye ücretsiz kaydolun"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {serverError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
            {serverError}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-sm font-medium text-white/70">
            Ad Soyad
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Adınız Soyadınız"
            {...register("fullName")}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-colors"
          />
          {errors.fullName && (
            <p className="text-xs text-red-400">{errors.fullName.message}</p>
          )}
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium text-white/70">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="En az 8 karakter"
            {...register("password")}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-colors"
          />
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70">
            Şifre Onayı
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Şifrenizi tekrar girin"
            {...register("confirmPassword")}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-colors"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl px-4 py-2.5 text-sm transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Kaydediliyor..." : "Hesap Oluştur"}
        </button>

        <p className="text-center text-xs text-white/40">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
            Giriş yapın
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
