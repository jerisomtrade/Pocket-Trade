"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SuccessProps = {
  children?: ReactNode;
  description: string;
  classNames?: {
    icon?: string;
    wrapper?: string;
    heading?: string;
    description?: string;
  };
};

const Success = ({ children, description, classNames }: SuccessProps) => {
  return (
    <div
      className={cn(
        "mx-auto w-[90%] max-w-md rounded-3xl p-8 backdrop-blur-xl bg-slate-900/50 border border-white/5 shadow-2xl flex flex-col items-center text-center",
        classNames?.wrapper
      )}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="mb-6"
      >
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className={cn("w-12 h-12 text-emerald-400", classNames?.icon)} />
        </div>
      </motion.div>
      
      <div className="mb-6">
        <h1 className={cn("text-3xl font-black text-white uppercase tracking-tighter mb-2", classNames?.heading)}>
          Success!
        </h1>
        <p className={cn("text-slate-400 font-medium", classNames?.description)}>
          {description}
        </p>
      </div>
      
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default Success;
