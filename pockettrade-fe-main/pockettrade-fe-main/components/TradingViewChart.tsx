"use client";

import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  theme?: "light" | "dark";
  autosize?: boolean;
  height?: number | string;
  width?: number | string;
  positive?: boolean;
}

export function TradingViewMiniChart({ 
  symbol, 
  theme = "dark", 
  height = "100%", 
  width = "100%",
  positive = true 
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Clear container
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: width,
      height: height,
      locale: "en",
      dateRange: "1D",
      colorTheme: theme,
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
      noTimeScale: false,
      chartOnly: false,
      trendLineColor: positive ? "rgba(16, 185, 129, 1)" : "rgba(239, 68, 68, 1)",
      underLineColor: positive ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
      underLineBottomColor: "rgba(0, 0, 0, 0)",
    });
    
    container.current.appendChild(script);

    return () => {
      if (container.current) container.current.innerHTML = "";
    };
  }, [symbol, theme, height, width, positive]);

  return (
    <div className="tradingview-widget-container w-full h-full [&>div]:!bg-transparent" ref={container} />
  );
}

export function TradingViewAdvancedChart({ 
  symbol, 
  theme = "dark" 
}: { symbol: string; theme?: "light" | "dark" }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear container
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (typeof TradingView !== "undefined") {
        // @ts-ignore
        new TradingView.widget({
          width: "100%",
          height: 500,
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview_widget",
        });
      }
    };
    
    container.current.appendChild(script);

    return () => {
      if (container.current) container.current.innerHTML = "";
    };
  }, [symbol, theme]);

  return (
    <div className="tradingview-widget-container" style={{ height: "500px" }}>
      <div id="tradingview_widget" ref={container} className="h-full" />
    </div>
  );
}
