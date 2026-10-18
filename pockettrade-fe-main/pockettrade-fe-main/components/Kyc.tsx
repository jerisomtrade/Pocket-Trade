"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileCheck,
  Upload,
  Check,
  AlertCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ApiResponse, Kyc } from "@/interfaces";
import { callApi } from "@/lib/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { KycType, zodValidator } from "@/lib/validators/validateWithZod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { KycData } from "@/interfaces/ApiResponse";
import { FormErrorMessage } from "./common";
import { useSession } from "@/store/useSession";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import countriesData from "world-countries";

const formattedCountries = countriesData
  .map((country) => ({
    value: country.cca2.toLowerCase(),
    label: country.name.common,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

// Static fallback data for states/provinces
const fallbackCountryData: { [key: string]: string[] } = {
  "United States": [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ],
  Canada: [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
  ],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Nigeria: [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "FCT",
  ],
  Australia: [
    "New South Wales",
    "Queensland",
    "South Australia",
    "Tasmania",
    "Victoria",
    "Western Australia",
  ],
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ],
};

export default function DashboardKyc() {
  const [step, setStep] = useState(1);
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const [selectKey, setSelectKey] = useState(0);
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const { user } = useSession((state) => state);
  const queryClient = useQueryClient();


  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<KycType>({
    resolver: zodResolver(zodValidator("kyc") as any),
    mode: "onChange",
  });

  const nationality = watch("nationality");
  const name = watch("name");
  const city = watch("city");
  const address = watch("address");
  const postalCode = watch("postalCode");
  const dob = watch("dob");
  const documentType = watch("documentType");

  const { data: kyc } = useQuery<Kyc[], Error>({
    queryKey: ["kyc"],
    queryFn: async () => {
      const { data: responseData, error } =
        await callApi<ApiResponse<Kyc[]>>("/kyc/find");
      if (error) throw new Error(error.message);
      return responseData?.data ?? [];
    },
  });

  const onSubmit: SubmitHandler<KycType> = async (data: KycType) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const { data: responseData, error } = await callApi<ApiResponse<KycData>>(
        "/kyc/create",
        formData,
      );

      if (error) throw new Error(error.message);

      toast.success("Verification Submitted", {
        description: "Your identity documents are being reviewed by our team.",
      });

      queryClient.invalidateQueries({ queryKey: ["kyc"] });
      setStep(4);
    } catch (err: any) {
      toast.error("Submission Failed", { description: err.message });
    } finally {
      reset();
      setIdentityFile(null);
      setSelfieFile(null);
      setAddressFile(null);
    }
  };

  const updateDob = (d: string, m: string, y: string) => {
    if (d && m && y) {
      const formattedDob = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      setValue("dob", formattedDob, { shouldValidate: true });
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const currentKyc = kyc?.[0];

  if (currentKyc?.status === "approved") {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-8">
        <div className="relative mx-auto w-24 h-24 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center border-2 border-emerald-500/30">
          <Check className="h-12 w-12 text-emerald-400" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full"
          >
            <ShieldCheck className="w-4 h-4" />
          </motion.div>
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">
            Identity <span className="gradient-text">Verified</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2">
            Your account is fully compliant and active. All restrictions have
            been lifted.
          </p>
        </div>
        <Card className="bg-slate-900/50 border-white/5 rounded-3xl p-8 glass-panel">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Status
              </p>
              <p className="text-emerald-400 font-bold">Approved</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Identity Type
              </p>
              <p className="text-white font-bold capitalize">
                {currentKyc.documentType.replace("_", " ")}
              </p>
            </div>
          </div>
        </Card>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl transition-all uppercase tracking-widest text-sm"
        >
          Return to Dashboard <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (currentKyc?.status === "pending") {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-amber-500/20 rounded-[2rem] flex items-center justify-center border-2 border-amber-500/30">
          <Clock className="h-12 w-12 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">
            Verification <span className="text-amber-400">Pending</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2">
            Our compliance team is reviewing your documents. This typically
            takes 1-3 business days.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl glass-panel max-w-sm mx-auto flex items-center gap-4 text-left">
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-300">
            Your funds and trading activity remain secure during this process.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">
            Identity <span className="gradient-text">Verification</span>
          </h1>
          <p className="text-slate-400 font-medium mt-1">
            Complete your KYC to unlock full institutional features.
          </p>
        </div>
        <div className="hidden md:flex h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
        </div>
      </div>

      <Progress
        value={(step / 3) * 100}
        className="h-2 bg-slate-900 border border-white/5 rounded-full overflow-hidden"
      />

      <Card className="bg-slate-900/50 border-white/5 rounded-[2.5rem] glass-panel shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-white/5 p-8 pb-4">
          <CardTitle className="text-xl font-black uppercase tracking-tight">
            Step {step}:{" "}
            {step === 1
              ? "Personal Details"
              : step === 2
                ? "Identity Document"
                : "Address Proof"}
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium italic">
            Ensure all information matches your official documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Full Legal Name
                      </label>
                      <Input
                        {...register("name")}
                        placeholder="John Doe"
                        className="h-14 rounded-2xl bg-slate-900/50! border-white/5 focus:border-emerald-500/30"
                      />
                      {errors.name && (
                        <FormErrorMessage
                          error={errors.name}
                          errorMsg={errors.name.message}
                        />
                      )}
                    </div>

                    <div className="flex flex-col gap-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Date of Birth
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <Select
                          onValueChange={(v: string | null) => {
                            if (!v) return;
                            setDay(v);
                            updateDob(v, month, year);
                          }}
                        >
                          <SelectTrigger className="h-14 rounded-2xl bg-slate-900/50 border-white/5">
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(
                              (d) => (
                                <SelectItem key={d} value={d.toString()}>
                                  {d}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(v: string | null) => {
                            if (!v) return;
                            setMonth(v);
                            updateDob(day, v, year);
                          }}
                        >
                          <SelectTrigger className="h-14 rounded-2xl bg-slate-900/50 border-white/5">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dec",
                            ].map((m, i) => (
                              <SelectItem key={m} value={(i + 1).toString()}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(v: string | null) => {
                            if (!v) return;
                            setYear(v);
                            updateDob(day, month, v);
                          }}
                        >
                          <SelectTrigger className="h-14 rounded-2xl bg-slate-900/50 border-white/5">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              { length: 100 },
                              (_, i) => new Date().getFullYear() - i - 18,
                            ).map((y) => (
                              <SelectItem key={y} value={y.toString()}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Nationality
                    </label>
                    <Select
                      onValueChange={(v: string | null) => {
                        {
                          if (!v) return;

                          setValue("nationality", v, { shouldValidate: true });
                          setValue("city", "");
                        }
                      }}
                    >
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-900/50 border-white/5">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {formattedCountries.map((c) => (
                          <SelectItem key={c.label} value={c.label}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Residential Address
                    </label>
                    <Input
                      {...register("address")}
                      placeholder="123 Financial Way"
                      className="h-14 rounded-2xl bg-slate-900/50 border-white/5 focus:border-emerald-500/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        City / State
                      </label>
                      {nationality &&
                      fallbackCountryData[nationality]?.length ? (
                        <Select
                          onValueChange={(v: string | null) => {
                            if (!v) return;
                            setValue("city", v, { shouldValidate: true });
                          }}
                        >
                          <SelectTrigger className="h-14 rounded-2xl bg-slate-900/50 border-white/5">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            {fallbackCountryData[nationality].map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          {...register("city")}
                          placeholder="City Name"
                          className="h-14 rounded-2xl bg-slate-900/50 border-white/5 focus:border-emerald-500/30"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Postal Code
                      </label>
                      <Input
                        {...register("postalCode")}
                        placeholder="ZIP / Postal"
                        className="h-14 rounded-2xl bg-slate-900/50 border-white/5 focus:border-emerald-500/30"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <Button
                      onClick={handleNext}
                      disabled={
                        !name ||
                        !city ||
                        !nationality ||
                        !postalCode ||
                        !address ||
                        !dob
                      }
                      className="h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-10 rounded-2xl uppercase tracking-widest transition-all"
                    >
                      Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-y-8"
                >
                  <div className="flex flex-col gap-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Document Type
                    </label>
                    <Select
                      onValueChange={(v: string | null) => {
                        if (!v) return;
                        setValue("documentType", v, { shouldValidate: true });
                      }}
                    >
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-900/50 border-white/5">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="drivers_license">
                          Driver&apos;s License
                        </SelectItem>
                        <SelectItem value="national_id">
                          National ID Card
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-y-3">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        ID Document Upload
                      </p>
                      <div className="relative group h-48 rounded-3xl border-2 border-dashed border-white/5 bg-slate-900/50 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                        <input
                          type="file"
                          id="id-doc"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setValue("document", f, { shouldValidate: true });
                              setIdentityFile(f);
                            }
                          }}
                        />
                        {identityFile ? (
                          <div className="text-center">
                            <FileCheck className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                            <p className="text-xs font-bold text-white max-w-[150px] truncate">
                              {identityFile.name}
                            </p>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-slate-600 mb-2 group-hover:text-emerald-400" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              Upload Front View
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-y-3">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Selfie Verification
                      </p>
                      <div className="relative group h-48 rounded-3xl border-2 border-dashed border-white/5 bg-slate-900/50 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                        <input
                          type="file"
                          id="selfie"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setValue("selfie", f, { shouldValidate: true });
                              setSelfieFile(f);
                            }
                          }}
                        />
                        {selfieFile ? (
                          <div className="text-center">
                            <FileCheck className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                            <p className="text-xs font-bold text-white max-w-[150px] truncate">
                              {selfieFile.name}
                            </p>
                          </div>
                        ) : (
                          <>
                            <Camera className="h-10 w-10 text-slate-600 mb-2 group-hover:text-emerald-400" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              Hold ID & Take Photo
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      className="h-14 rounded-2xl border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-xs"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!identityFile || !selfieFile || !documentType}
                      className="h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-10 rounded-2xl uppercase tracking-widest transition-all"
                    >
                      Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-y-8"
                >
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      Upload a utility bill, bank statement, or official
                      correspondence issued within the last 3 months clearly
                      showing your full name and address.
                    </p>
                  </div>

                  <div className="relative group h-64 rounded-[2.5rem] border-2 border-dashed border-white/5 bg-slate-900/50 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                    <input
                      type="file"
                      id="address-doc"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setValue("proofOfAddress", f, {
                            shouldValidate: true,
                          });
                          setAddressFile(f);
                        }
                      }}
                    />
                    {addressFile ? (
                      <div className="text-center">
                        <FileCheck className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                        <p className="text-sm font-black text-white">
                          {addressFile.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 italic font-medium">
                          Click to replace file
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-16 w-16 text-slate-700 mb-4 group-hover:text-emerald-400 group-hover:scale-110 transition-all" />
                        <p className="text-sm font-black text-slate-500 uppercase tracking-widest">
                          Drop Proof of Address Here
                        </p>
                        <p className="text-[10px] text-slate-600 mt-2 font-bold">
                          JPG, PNG or PDF (MAX. 10MB)
                        </p>
                      </>
                    )}
                  </div>

                  <div className="pt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      className="h-14 rounded-2xl border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-xs"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button
                      type="submit"
                      disabled={!addressFile || isSubmitting}
                      className="h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-10 rounded-2xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="mr-2"
                          >
                            <Clock className="h-5 w-5" />
                          </motion.div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Submit Verification{" "}
                          <ShieldCheck className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
          Your data is encrypted using AES-256 and handled in accordance with
          GDPR guidelines.
        </p>
      </div>
    </div>
  );
}
