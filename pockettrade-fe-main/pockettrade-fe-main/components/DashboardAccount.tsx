"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { User, Shield, Camera, EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/store/useSession";
import {
  checkPasswordStrength,
  ResetPasswordType,
  UpdateProfileType,
  updateProfileSchema,
  resetPasswordSchema,
} from "@/lib/validators/validateWithZod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ApiResponse, SessionData } from "@/interfaces/ApiResponse";
import { callApi } from "@/lib/helpers";
import { FormErrorMessage } from "./common";
import { motion } from "framer-motion";
import Image from "next/image";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function DashboardAccount() {
  const {
    user,
    actions: { updateUser },
  } = useSession((state) => state);

  const [profileImage, setProfileImage] = useState(user && user[0].photo);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    email: user ? user[0].email : "",
    firstName: user ? user?.[0]?.firstName : "",
    lastName: user ? user?.[0]?.lastName : "",
    photo: undefined,
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileType>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: initialValues,
  });

  const {
    handleSubmit: handleSubmit2,
    register: register2,
    watch: watch2,
    reset: reset2,
    formState: { errors: errors2, isSubmitting: isSubmitting2 },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (user && user[0]) {
      setProfileImage(user[0].photo || "");
      reset({
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        photo: undefined,
      });
    }
  }, [user, reset]);

  const formValues = watch();
  const hasChanges = () => {
    const { email, firstName, lastName, photo } = formValues;
    return (
      (email || "") !== (initialValues.email || "") ||
      (firstName || "") !== (initialValues.firstName || "") ||
      (lastName || "") !== (initialValues.lastName || "") ||
      photo instanceof File
    );
  };

  const password = watch2("password", "");
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const deferredPassword = useDeferredValue(password);

  useEffect(() => {
    const checkStrength = async () => {
      if (deferredPassword) {
        const strength = await checkPasswordStrength(deferredPassword);
        setPasswordStrength(strength);
      }
    };
    checkStrength().catch(() => {});
  }, [deferredPassword]);

  const onSubmit: SubmitHandler<UpdateProfileType> = async (data) => {
    try {
      setIsLoading(true);
      const filteredUpdates = Object.fromEntries(
        Object.entries({
          email: data.email || undefined,
          firstName: data.firstName || undefined,
          lastName: data.lastName || undefined,
        }).filter(([, v]) => v !== undefined && v !== "")
      );

      let profileUpdated = false;
      let photoUpdated = false;

      if (Object.keys(filteredUpdates).length > 0) {
        const { data: responseData, error } = await callApi<ApiResponse<SessionData>>("/user/update-user", filteredUpdates);
        if (error) throw new Error(error.message);
        if (responseData?.status === "success") {
          toast.success("Profile Updated", { description: "Your profile has been updated successfully." });
          profileUpdated = true;
        }
        if (responseData?.data) updateUser({ user: responseData.data[0] });
      }

      if (data.photo instanceof File) {
        const fd = new FormData();
        fd.append("photo", data.photo);
        const { data: photoResponse, error: photoError } = await callApi<ApiResponse<SessionData>>("/user/upload-profile-picture", fd);
        if (photoError) throw new Error(photoError.message);
        if (photoResponse?.status === "success") {
          toast.success("Photo Updated");
          photoUpdated = true;
        }
        if (photoResponse?.data) {
          updateUser({ user: photoResponse.data[0] });
          setProfileImage(photoResponse.data[0].photo ?? profileImage);
        }
      }

      if (profileUpdated || photoUpdated) reset();
    } catch (err) {
      toast.error("Update Failed", { description: err instanceof Error ? err.message : "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit2 = async (data: ResetPasswordType) => {
    const { data: responseData, error } = await callApi<ApiResponse>("/auth/password/change", {
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    if (error) {
      toast.error("Error", { description: error.message });
    } else {
      toast.success("Password Updated", { description: responseData?.message || "Password changed successfully!" });
      reset2();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setValue("photo", file, { shouldValidate: true });
    } else {
      setProfileImage(user && user[0].photo);
      setValue("photo", undefined, { shouldValidate: true });
    }
  };

  const initials = user?.[0]
    ? `${user[0].firstName?.[0] || ""}${user[0].lastName?.[0] || ""}`.toUpperCase()
    : "U";

  return (
    <div className="flex flex-col gap-y-8 max-w-4xl mx-auto pb-20 mt-16 lg:mt-0">
      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-slate-900/50 border-white/5 overflow-hidden backdrop-blur-xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
          
          <CardHeader className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8">
            <label htmlFor="profileUpload" className="relative cursor-pointer group flex-shrink-0">
              <Avatar className="w-24 h-24 border-2 border-white/10 group-hover:border-emerald-500/50 transition-colors shadow-2xl">
                <AvatarImage src={profileImage || ""} className="object-cover" />
                <AvatarFallback className="bg-white/5 text-3xl font-black text-slate-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4 text-slate-950" />
              </div>
            </label>
            <input
              type="file" id="profileUpload" accept="image/*"
              {...register("photo", { onChange: handleImageChange })}
              className="hidden"
            />

            <div className="flex-1">
              <CardTitle className="text-3xl font-black text-white tracking-tighter mb-1">
                {user?.[0]?.firstName} {user?.[0]?.lastName}
              </CardTitle>
              <CardDescription className="text-slate-400 font-medium text-base mb-2">
                {user?.[0]?.email}
              </CardDescription>
              <div className="inline-block text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                Verified Investor
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-slate-900/50 border border-white/5 p-1 rounded-xl w-fit mb-6">
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 rounded-lg px-6 py-2.5 font-black text-xs uppercase tracking-widest transition-all"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 rounded-lg px-6 py-2.5 font-black text-xs uppercase tracking-widest transition-all"
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Personal Information</CardTitle>
                <CardDescription className="text-slate-400">Update your account details and contact information.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">First Name</label>
                      <Input
                        {...register("firstName")}
                        className={`h-12 bg-slate-950 border-white/10 text-white focus-visible:ring-emerald-500/50 ${errors.firstName ? "border-red-500/50" : ""}`}
                        placeholder="John"
                      />
                      {errors.firstName && <FormErrorMessage error={errors.firstName} errorMsg={errors.firstName.message} />}
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Name</label>
                      <Input
                        {...register("lastName")}
                        className={`h-12 bg-slate-950 border-white/10 text-white focus-visible:ring-emerald-500/50 ${errors.lastName ? "border-red-500/50" : ""}`}
                        placeholder="Doe"
                      />
                      {errors.lastName && <FormErrorMessage error={errors.lastName} errorMsg={errors.lastName.message} />}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                    <Input
                      {...register("email")}
                      type="email"
                      className={`h-12 bg-slate-950 border-white/10 text-white focus-visible:ring-emerald-500/50 ${errors.email ? "border-red-500/50" : ""}`}
                      placeholder="john.doe@example.com"
                    />
                    {errors.email && <FormErrorMessage error={errors.email} errorMsg={errors.email.message} />}
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || isLoading || !hasChanges()}
                      className="h-12 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl max-w-xl">
              <CardHeader>
                <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Change Password</CardTitle>
                <CardDescription className="text-slate-400">Update your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit2(onSubmit2)} className="flex flex-col gap-y-6">
                  <div className="flex flex-col gap-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      New Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        {...register2("password")}
                        type={showPassword ? "text" : "password"}
                        className={`h-12 bg-slate-950 border-white/10 text-white pr-12 focus-visible:ring-emerald-500/50 ${errors2.password ? "border-red-500/50" : ""}`}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white hover:bg-transparent"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {password.length > 0 && <FormErrorMessage isForPasswordStrength result={passwordStrength} />}
                    {errors2.password?.message && <FormErrorMessage error={errors2} errorMsg={errors2.password.message} />}
                  </div>

                  <div className="flex flex-col gap-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Confirm Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        {...register2("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        className={`h-12 bg-slate-950 border-white/10 text-white pr-12 focus-visible:ring-emerald-500/50 ${errors2.confirmPassword ? "border-red-500/50" : ""}`}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white hover:bg-transparent"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {errors2.confirmPassword?.message && <FormErrorMessage error={errors2} errorMsg={errors2.confirmPassword.message} />}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting2}
                    className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  >
                    {isSubmitting2 ? "Updating..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
