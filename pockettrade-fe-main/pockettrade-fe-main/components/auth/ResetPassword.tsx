"use client";

import React, { useDeferredValue, useEffect, useState } from "react";
import { Lock, ArrowRight, EyeOff, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { callApi } from "@/lib/helpers";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { resetPasswordSchema, checkPasswordStrength } from "@/lib/validators/validateWithZod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ApiResponse, ResetPasswordProps } from "@/interfaces";
import { FormErrorMessage } from "../common";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ResetPassword = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const queryToken = new URLSearchParams(window.location.search).get("token");
    setToken(queryToken);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordProps>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const password = watch("password", "");
  const deferredPassword = useDeferredValue(password);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  useEffect(() => {
    const checkStrength = async () => {
      if (deferredPassword) {
        const strength = await checkPasswordStrength(deferredPassword);
        setPasswordStrength(strength);
      }
    };
    checkStrength().catch(() => {});
  }, [deferredPassword]);

  const onSubmit: SubmitHandler<ResetPasswordProps> = async (data: ResetPasswordProps) => {
    if (!token) {
      toast.error("Request Failed", {
        description: "No reset token provided. Please use the link from your email.",
      });
      return;
    }

    const { data: responseData, error } = await callApi<ApiResponse>(
      "/auth/password/reset",
      {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }
    );

    if (error) {
      toast.error("Error", { description: error.message });
    } else {
      toast.success("Success", {
        description: responseData?.message || "Password reset successful!",
      });
      router.push("/reset-password/success");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black mb-3 text-white">
          New <span className="gradient-text">Password</span>
        </h1>
        <p className="text-slate-400 font-medium">
          Set a secure new password for your account
        </p>
      </div>

      <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
            New Password <span className="text-emerald-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-500" />
            </div>
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`h-14 pl-12 pr-12 bg-slate-900/50 border rounded-2xl text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/50 transition-all shadow-inner ${
                errors.password ? "border-red-500" : "border-white/10"
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 h-full flex items-center text-slate-500 hover:text-white bg-transparent hover:bg-transparent"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
            </Button>
          </div>
          {password.length > 0 && (
            <div className="px-1 mt-2">
              <FormErrorMessage isForPasswordStrength result={passwordStrength} />
            </div>
          )}
          {errors.password && <p className="text-red-400 text-xs font-medium ml-1 mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
            Confirm Password <span className="text-emerald-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-500" />
            </div>
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`h-14 pl-12 pr-12 bg-slate-900/50 border rounded-2xl text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/50 transition-all shadow-inner ${
                errors.confirmPassword ? "border-red-500" : "border-white/10"
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-2 h-full flex items-center text-slate-500 hover:text-white bg-transparent hover:bg-transparent"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
            </Button>
          </div>
          {errors.confirmPassword && <p className="text-red-400 text-xs font-medium ml-1 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 mt-4 text-base font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? "UPDATING PASSWORD..." : "UPDATE PASSWORD"} {!isSubmitting && <ArrowRight className="w-5 h-5" />}
        </Button>

        <div className="text-center pt-6">
          <Link
            href="/login"
            className="text-slate-400 font-medium hover:text-white transition-colors"
          >
            Back to <span className="text-emerald-400 font-black ml-1">SIGN IN</span>
          </Link>
        </div>
      </form>
    </div>
  );
};
