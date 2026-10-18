"use client";

import { useState, useEffect } from "react";
import { Bitcoin, PieChart, TrendingUp, Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AssetLogoProps {
  symbol: string;
  name?: string;
  type?: "crypto" | "stocks" | "etfs" | string;
  className?: string;
}

const TOKEN = "pk_BOmLLlQRSWe2uLPHrJzmmA";

function getSources(symbol: string, type: AssetLogoProps["type"]): string[] {
  const upper = symbol.toUpperCase();
  const lower = symbol.toLowerCase();

  if (type === "crypto") {
    return [
      `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/128/color/${lower}.png`,
      `https://img.logo.dev/${lower}?token=${TOKEN}`,
    ];
  }

  return [
    `https://img.logo.dev/${lower}.com?token=${TOKEN}`,
    `https://assets.parqet.com/logos/symbol/${upper}?format=png`,
  ];
}

const cache = new Map<string, string | null>();

const FallbackIcon = ({ type }: { type: AssetLogoProps["type"] }) => {
  const cls = "h-1/2 w-1/2";
  if (type === "crypto")
    return <Bitcoin className={cn(cls, "text-amber-500")} />;
  if (type === "etfs") return <PieChart className={cn(cls, "text-blue-500")} />;
  if (type === "stocks")
    return <TrendingUp className={cn(cls, "text-green-500")} />;
  return <Building2 className={cn(cls, "text-gray-400")} />;
};

export function AssetLogo({ symbol, name, type, className }: AssetLogoProps) {
  const cacheKey = `${type}:${symbol}`;
  const sources = getSources(symbol, type);

  const [index, setIndex] = useState(0);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    setIndex(0);
    setDead(false);
  }, [symbol, type]);

  const cached = cache.get(cacheKey);
  const src = cached !== undefined ? cached : sources[index];

  const handleLoad = () => cache.set(cacheKey, src!);

  const handleError = () => {
    if (index < sources.length - 1) {
      setIndex((i) => i + 1);
    } else {
      cache.set(cacheKey, null);
      setDead(true);
    }
  };

  return (
    <Avatar className={cn("h-10 w-10 border bg-white shadow-sm", className)}>
      {src && !dead && (
        <AvatarImage
          src={src}
          alt={name ?? symbol}
          onLoad={handleLoad}
          onError={handleError}
          className="object-contain p-1"
        />
      )}
      <AvatarFallback className="bg-gray-50 flex items-center justify-center">
        <FallbackIcon type={type} />
      </AvatarFallback>
    </Avatar>
  );
}
