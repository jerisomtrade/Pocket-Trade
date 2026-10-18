"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EyeOff, EyeClosed, Mail, Lock, User, Phone, Globe, ArrowRight, Shield, Zap, RefreshCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/store";
import { ApiResponse, SignUpProps } from "@/interfaces";
import { callApi } from "@/lib/helpers";
import { toast } from "sonner";
import { SessionData } from "@/interfaces/ApiResponse";
import { SubmitHandler, useForm } from "react-hook-form";
import { signUpSchema } from "@/lib/validators/validateWithZod";
import { zodResolver } from "@hookform/resolvers/zod";
import countries from "world-countries";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formattedCountries = countries
  .map((country) => ({
    value: country.cca2.toLowerCase(),
    label: country.name.common,
    dialCode: country.idd.root + (country.idd.suffixes?.[0] || ""),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { user } = useSession((state) => state);
  const searchParams = useSearchParams();
  const referrerCode = searchParams.get("ref");

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpProps>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      country: formattedCountries.find((c) => c.value === "us")?.label || formattedCountries[0].label,
    },
  });

  const onSubmit: SubmitHandler<SignUpProps> = async (data: SignUpProps) => {
    try {
      setIsLoading(true);
      const payload: {
        email: string;
        password: string;
        phone: string;
        country: string;
        firstName: string;
        lastName: string;
        referrerCode?: string;
      } = {
        email: data.email,
        password: data.password,
        phone: data.phone,
        country: data.country,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      if (referrerCode) {
        payload.referrerCode = referrerCode;
      }

      const { data: responseData, error } = await callApi<
        ApiResponse<SessionData>
      >("/auth/sign-up", payload);

      if (error) {
        throw new Error(error.message);
      }

      if (responseData?.data) {
        toast.success("Registration successful!", {
          description: "Check your email or spam to complete verification.",
        });
        router.push("/signup/success");
      }
    } catch (err) {
      toast.error("Registration Failed", {
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedCountry, setSelectedCountry] = useState(
    formattedCountries.find((c) => c.value === "us") || formattedCountries[0]
  );
  
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(
    formattedCountries.find((c) => c.value === "us") || formattedCountries[0]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black mb-3 text-white">
          Create <span className="gradient-text">Account</span>
        </h1>
        <p className="text-slate-400 font-medium">
          Join the premier institutional trading platform
        </p>
      </div>

      <form className="flex flex-col gap-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
           <div className="flex flex-col gap-y-2">
             <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
               First Name <span className="text-emerald-500">*</span>
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <User className="h-4 w-4 text-slate-500" />
               </div>
                <Input
                  {...register("firstName")}
                  type="text"
                  placeholder="John"
                  className={`h-12 pl-10 bg-slate-900/50 border rounded-xl text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/50 transition-all shadow-inner text-sm ${
                    errors.firstName ? "border-red-500" : "border-white/10"
                  }`}
                />
             </div>
             {errors.firstName && <p className="text-red-400 text-xs font-medium ml-1 mt-1">{errors.firstName.message}</p>}
           </div>

           <div className="flex flex-col gap-y-2">
             <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
               Last Name <span className="text-emerald-500">*</span>
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <User className="h-4 w-4 text-slate-500" />
               </div>
                <Input
                  {...register("lastName")}
                  type="text"
                  placeholder="Doe"
                  className={`h-12 pl-10 bg-slate-900/50 border rounded-xl text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/50 transition-all shadow-inner text-sm ${
                    errors.lastName ? "border-red-500" : "border-white/10"
                  }`}
                />
             </div>
             {errors.lastName && <p className="text-red-400 text-xs font-medium ml-1 mt-1">{errors.lastName.message}</p>}
           </div>
        </div>

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
              placeholder="name@example.com"
              className={`h-14 pl-12 bg-slate-900/50 border rounded-2xl text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/50 transition-all shadow-inner ${
                errors.email ? "border-red-500" : "border-white/10"
              }`}
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs font-medium ml-1 mt-1">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
            Phone Number <span className="text-emerald-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="w-1/3 relative">
               <Select
                 value={selectedPhoneCountry.value}
                 onValueChange={(v) => {
                   const c = formattedCountries.find((c) => c.value === v);
                   if (c) setSelectedPhoneCountry(c);
                 }}
               >
                 <SelectTrigger className="h-14 pl-4 pr-2 bg-slate-900/50 border-white/10 rounded-2xl text-white focus:ring-emerald-500/50 uppercase font-medium">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent className="bg-slate-900 border-white/10 text-white max-h-[300px]">
                   {formattedCountries.map(c => (
                     <SelectItem key={`phone-${c.value}`} value={c.value}>{c.value.toUpperCase()} ({c.dialCode})</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
            <div className="w-2/3 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-500" />
              </div>
              <Input
                {...register("phone")}
                type="tel"
                placeholder="Phone number"
                className={`h-14 pl-12 bg-slate-900/50 border rounded-2xl text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/50 transition-all shadow-inner ${
                  errors.phone ? "border-red-500" : "border-white/10"
                }`}
              />
            </div>
          </div>
          {errors.phone && <p className="text-red-400 text-xs font-medium ml-1 mt-1">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
            Country <span className="text-emerald-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Globe className="h-5 w-5 text-slate-500" />
            </div>
            <Select
               value={selectedCountry.label}
               onValueChange={(v) => {
                 const c = formattedCountries.find((c) => c.label === v);
                 if (c) {
                    setSelectedCountry(c);
                    setValue("country", c.label, { shouldValidate: true });
                 }
               }}
            >
               <SelectTrigger className={`h-14 pl-12 bg-slate-900/50 border rounded-2xl text-white placeholder:text-slate-600 focus:ring-emerald-500/50 transition-all shadow-inner appearance-none ${
                 errors.country ? "border-red-500" : "border-white/10"
               }`}>
                 <SelectValue placeholder="Select country..." />
               </SelectTrigger>
               <SelectContent className="bg-slate-900 border-white/10 text-white max-h-[300px]">
                 {formattedCountries.map(c => (
                   <SelectItem key={`country-${c.value}`} value={c.label}>{c.label}</SelectItem>
                 ))}
               </SelectContent>
            </Select>
          </div>
          {errors.country && <p className="text-red-400 text-xs font-medium ml-1 mt-1">{errors.country.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="flex flex-col gap-y-2">
             <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
               Password <span className="text-emerald-500">*</span>
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Lock className="h-4 w-4 text-slate-500" />
               </div>
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-12 pl-10 pr-10 bg-slate-900/50 border rounded-xl text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/50 transition-all shadow-inner text-sm ${
                    errors.password ? "border-red-500" : "border-white/10"
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-1 h-full flex items-center text-slate-500 hover:text-white bg-transparent hover:bg-transparent"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
                </Button>
             </div>
             {errors.password && <p className="text-red-400 text-xs font-medium ml-1 mt-1">{errors.password.message}</p>}
           </div>

           <div className="flex flex-col gap-y-2">
             <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
               Confirm <span className="text-emerald-500">*</span>
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Lock className="h-4 w-4 text-slate-500" />
               </div>
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-12 pl-10 pr-10 bg-slate-900/50 border rounded-xl text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/50 transition-all shadow-inner text-sm ${
                    errors.confirmPassword ? "border-red-500" : "border-white/10"
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-1 h-full flex items-center text-slate-500 hover:text-white bg-transparent hover:bg-transparent"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <EyeClosed className="h-4 w-4" />}
                </Button>
             </div>
             {errors.confirmPassword && <p className="text-red-400 text-xs font-medium ml-1 mt-1">{errors.confirmPassword.message}</p>}
           </div>
        </div>

         <div className="flex items-center space-x-3 pt-2">
            <Checkbox
              id="terms"
              className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-slate-950"
              checked={watch("isTerms")}
              onCheckedChange={(checked) => setValue("isTerms", !!checked, { shouldValidate: true })}
            />
            <label htmlFor="terms" className="text-slate-400 text-sm font-medium leading-none cursor-pointer">
             I agree to the{" "}
             <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">
               Terms of Service
             </Link>{" "}
             and{" "}
             <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">
               Privacy Policy
             </Link>
           </label>
        </div>
        {errors.isTerms && <p className="text-red-400 text-xs font-medium ml-1">{errors.isTerms.message}</p>}

        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full h-14 mt-6 text-base font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting || isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"} {!isSubmitting && !isLoading && <ArrowRight className="w-5 h-5" />}
        </Button>

        <div className="text-center pt-4">
          <p className="text-slate-400 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white font-black hover:text-emerald-400 transition-colors ml-1"
            >
              SIGN IN
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
