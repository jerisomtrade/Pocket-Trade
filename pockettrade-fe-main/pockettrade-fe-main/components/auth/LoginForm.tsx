"use client";

import { ApiResponse, LoginProps } from "@/interfaces";
import { SessionData } from "@/interfaces/ApiResponse";
import { callApi } from "@/lib/helpers";
import { loginSchema } from "@/lib/validators/validateWithZod";
import { useSession } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, EyeClosed, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isUnverified, setIsUnverified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const { user, loading } = useSession((state) => state);

  useEffect(() => {
    if (!loading && user) {
      const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");
      const isValidRedirect = redirectAfterLogin?.startsWith("/dashboard");

      if (redirectAfterLogin && isValidRedirect) {
        if (redirectAfterLogin === "/dashboard/logout") {
          localStorage.removeItem("redirectAfterLogin");
          router.replace("/dashboard");
          return;
        }

        localStorage.removeItem("redirectAfterLogin");
        router.replace(redirectAfterLogin);
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, router]);

  const {
    actions: { updateUser },
  } = useSession((state) => state);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginProps>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginProps> = async (data: LoginProps) => {
    try {
      setIsLoading(true);
      setIsUnverified(false);
      const { data: responseData, error } = await callApi<
        ApiResponse<SessionData>
      >("/auth/sign-in", {
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("verify your email")) {
          setIsUnverified(true);
        }
        throw new Error(error.message);
      }

      if (responseData?.data) {
        toast.success("Sign in successful!", {
          description: "Successfully signed in.",
        });

        const firstUser = responseData.data[0];
        if (!firstUser) {
          throw new Error("User data not found");
        }

        updateUser({ user: firstUser });

        router.replace("/dashboard");
      }
    } catch (err) {
      toast.error("Sign In Failed", {
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Email required", {
        description: "Please enter your email to resend the verification link.",
      });
      return;
    }

    try {
      setIsResending(true);
      const { error } = await callApi("/auth/resend-verification", { email });
      if (error) throw new Error(error.message);

      toast.success("Verification link sent", {
        description: `A new verification link has been sent to ${email}.`,
      });
      setIsUnverified(false);
    } catch (err) {
      toast.error("Resend Failed", {
        description:
          err instanceof Error
            ? err.message
            : "Failed to resend verification link.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black mb-3 text-white">
          Welcome <span className="gradient-text">Back</span>
        </h1>
        <p className="text-slate-400 font-medium">
          Sign in to access your trading dashboard
        </p>
      </div>

      <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="email"
            className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1"
          >
            Email Address <span className="text-emerald-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-500" />
            </div>
            <Input
              {...register("email")}
              type="email"
              id="email"
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

        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="password"
            className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1"
          >
            Password <span className="text-emerald-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-500" />
            </div>
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
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
              className="absolute inset-y-0 right-2 h-full flex items-center text-slate-500 hover:text-white transition-colors bg-transparent hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <EyeClosed className="h-5 w-5" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs font-medium ml-1 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center text-sm px-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-slate-950"
            />
            <label
              htmlFor="remember"
              className="text-slate-400 font-medium text-sm leading-none cursor-pointer"
            >
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full h-14 mt-4 text-base font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting || isLoading ? "SIGNING IN..." : "SIGN IN"}{" "}
          {!isSubmitting && !isLoading && <ArrowRight className="w-5 h-5" />}
        </Button>

        {isUnverified && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex flex-col gap-4 mt-6 backdrop-blur-sm"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Mail className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-black uppercase tracking-tight mb-1">
                  Verification Required
                </p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Your account is not verified yet. We've sent a link to your
                  email. Didn't receive it?
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-400 h-12 font-black rounded-xl transition-all text-xs uppercase tracking-widest bg-transparent"
            >
              {isResending ? "SENDING LINK..." : "RESEND VERIFICATION EMAIL"}
            </Button>
          </motion.div>
        )}

        <div className="text-center pt-6">
          <p className="text-slate-400 font-medium">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-white font-black hover:text-emerald-400 transition-colors ml-1"
            >
              CREATE ONE
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
