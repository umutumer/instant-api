"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const schema = z
  .object({
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

export default function ResetPasswordPage() {
  const router = useRouter();
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
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      if (error.message.includes("same password")) {
        setServerError("Yeni şifreniz mevcut şifrenizle aynı olamaz.");
      } else if (error.message.includes("session")) {
        setServerError(
          "Oturumunuz sona ermiş. Lütfen şifre sıfırlama işlemini yeniden başlatın."
        );
      } else {
        setServerError("Şifre güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 3000);
  };

  if (success) {
    return (
      <AuthLayout title="Şifre Güncellendi">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-12 h-12 text-violet-400" />
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Şifreniz başarıyla güncellendi. Birkaç saniye içinde giriş sayfasına
            yönlendirileceksiniz.
          </p>
          <Link
            href="/login"
            className="inline-block text-violet-400 hover:text-violet-300 text-sm transition-colors"
          >
            Hemen giriş yap
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Yeni Şifre Belirle"
      subtitle="Güvenli bir şifre seçin"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {serverError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
            {serverError}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-white/70">
            Yeni Şifre
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
            Yeni Şifre Onayı
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
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Güncelleniyor..." : "Şifremi Güncelle"}
        </button>
      </form>
    </AuthLayout>
  );
}
