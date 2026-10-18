import { create } from "zustand";
import { persist } from "zustand/middleware";

type DemoStore = {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
};

export const useDemoMode = create<DemoStore>()(
  persist(
    (set) => ({
      isDemoMode: false,
      toggleDemoMode: () => {
        set((state) => ({
          isDemoMode: !state.isDemoMode,
        }));
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      },
    }),
    {
      name: "demo-mode-storage",
    }
  )
);
