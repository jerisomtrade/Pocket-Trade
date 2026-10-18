import { JSX } from "react";
import Image from "next/image";

type CompProp = {
  message?: string | JSX.Element;
};

const Loader = ({ message }: CompProp) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden bg-[#020617] font-medium">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-blue-500 animate-spin" style={{ animationDirection: 'reverse' }}></div>
        <div className="relative h-10 w-10">
          <Image src="/assets/jerisom.png" alt="Loading..." fill className="object-contain" />
        </div>
      </div>
      {message && <p className="text-emerald-500 font-bold tracking-widest text-sm uppercase">{message}</p>}
    </div>
  );
};

export default Loader;
