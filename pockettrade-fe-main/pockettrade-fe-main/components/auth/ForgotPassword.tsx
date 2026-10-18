"use client";

import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { callApi } from "@/lib/helpers";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { forgotPasswordSchema } from "@/lib/validators/validateWithZod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ApiResponse, ForgotPasswordProps } from "@/interfaces";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordProps>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<ForgotPasswordProps> = async (data: ForgotPasswordProps) => {
    try {
      setIsLoading(true);
      const { data: responseData, error } = await callApi<ApiResponse>(
        "/auth/password/forgot",
        {
          email: data.email.trim(),
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Success", {
        description: responseData?.message || "Password reset link sent to your email.",
      });
      reset();
      router.push(`/forgot-password/sent?email=${encodeURIComponent(data.email.toLowerCase())}`);
    } catch (err) {
      toast.error("Error", {
        description: err instanceof Error ? err.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black mb-3 text-white">
          Reset <span className="gradient-text">Password</span>
        </h1>
        <p className="text-slate-400 font-medium">
          Enter your email to receive a password reset link
        </p>
      </div>

      <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
            Email Address <span className="text-emerald-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-500" />
            </div>
            <Input
              {...register("email")}
              type="email"
              autoFocus
              placeholder="name@example.com"
              className={`h-14 pl-12 bg-slate-900/50 border rounded-2xl text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/50 transition-all shadow-inner ${
                errors.email ? "border-red-500" : "border-white/10"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs font-medium ml-1 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full h-14 mt-4 text-base font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting || isLoading ? "SENDING LINK..." : "SEND RESET LINK"} {!isSubmitting && !isLoading && <ArrowRight className="w-5 h-5" />}
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
