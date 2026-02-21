"use client";

import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signIn } = useAuthActions();

  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.set("flow", step === "signIn" ? "signIn" : "signUp");
    try {
      await signIn("password", formData);
      onOpenChange(false);
    } catch {
      setError(
        step === "signIn"
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
          : "حدث خطأ أثناء إنشاء الحساب, حاول مرة أخرى.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "facebook") {
    setOauthLoading(provider);
    try {
      await signIn(provider);
    } catch {
      setError("فشل تسجيل الدخول, حاول مرة أخرى.");
      setOauthLoading(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden gap-0"
        dir="rtl"
      >
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6 text-center">
            <DialogTitle className="text-2xl font-bold">
              {step === "signIn" ? "أهلاً بعودتك" : "إنشاء حساب جديد"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {step === "signIn"
                ? "سجّل دخولك للمتابعة"
                : "انضم إلى بيت السعادة اليوم"}
            </p>
          </DialogHeader>
          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={!!oauthLoading}
              className="flex items-center justify-center gap-3 w-full h-11 rounded-xl border border-border bg-background hover:bg-muted transition-colors font-medium text-sm disabled:opacity-60 disabled:pointer-events-none"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              المتابعة عبر جوجل
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("facebook")}
              disabled={!!oauthLoading}
              className="flex items-center justify-center gap-3 w-full h-11 rounded-xl border border-border bg-[#1877F2] hover:bg-[#166FE5] transition-colors font-medium text-sm text-white disabled:opacity-60 disabled:pointer-events-none"
            >
              {oauthLoading === "facebook" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-white"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
              المتابعة عبر فيسبوك
            </button>
          </div>
          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">
                أو عبر البريد الإلكتروني
              </span>
            </div>
          </div>
          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {step === "signUp" && (
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="name"
                  type="text"
                  placeholder="الاسم الكامل"
                  className="pr-10 h-11 rounded-xl"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="email"
                type="email"
                placeholder="البريد الإلكتروني"
                className="pr-10 h-11 rounded-xl"
                required
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور"
                className="pr-10 pl-10 h-11 rounded-xl"
                required
                autoComplete={
                  step === "signIn" ? "current-password" : "new-password"
                }
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {error && (
              <p className="flex items-center justify-center gap-2 text-red-500 font-medium text-xs text-center bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <AlertTriangle className="h-4 w-4" /> {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-semibold mt-1 gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {step === "signIn" ? "تسجيل الدخول" : "إنشاء الحساب"}
            </Button>
          </form>
          {/* Toggle step */}
          <p className="text-center text-sm text-muted-foreground mt-5">
            {step === "signIn" ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
            <button
              type="button"
              onClick={() => {
                setStep(step === "signIn" ? "signUp" : "signIn");
                setError(null);
              }}
              className="text-primary font-semibold hover:underline"
            >
              {step === "signIn" ? "أنشئ حسابًا" : "سجّل دخولك"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
