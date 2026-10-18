import type { ApiResponse, User } from "@/interfaces";
import type { SessionData, Wallet } from "@/interfaces/ApiResponse";
import { callApi } from "@/lib/helpers/callApi";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { SelectorFn } from "./store-types";

type Session = {
  isFirstMount: boolean;
  loading: boolean;
  user: User[] | null;

  wallet: Wallet | null;
  actions: {
    clearSession: () => void;
    updateUser: (data: { user: User }) => void;
    getSession: (isInitialLoad?: boolean) => Promise<void>;
  };
};

const initialState = {
  loading: true,
  user: null,
  wallet: null,
  isFirstMount: false,
};

export const useInitSession = create<Session>()((set, get) => ({
  ...initialState,

  actions: {
    getSession: async (isInitialLoad) => {
      if (typeof isInitialLoad === "boolean") {
        set({ isFirstMount: true });
      }

      const { data, error } = await callApi<ApiResponse<SessionData>>("/user");
      if (error) {
        console.error("Session error:", error);
      }

      set({
        user: data?.data || null,
        wallet: null,
        loading: false,
      });

      const { data: walletData } =
        await callApi<ApiResponse<Wallet[]>>("/wallet/user");
      set({
        user: (data?.data || []).map((u) => ({
          ...u,
          wallet: walletData?.data?.[0] ?? null,
        })),
        wallet: walletData?.data?.[0] ?? null,
        loading: false,
      });
    },

    updateUser: (data) => set({ user: [data.user], wallet: null }),

    clearSession: () => {
      set((state) => ({
        ...initialState,
        loading: false,
        isFirstMount: state.isFirstMount,
      }));

      if (typeof window !== "undefined") {
        const currentPageUrl = window.location.pathname;

        if (
          !currentPageUrl.includes("/dashboard") &&
          currentPageUrl !== "/signin" &&
          currentPageUrl !== "/login" &&
          currentPageUrl !== "/signup" &&
          currentPageUrl !== "/auth" &&
          currentPageUrl !== "/forgot-password" &&
          currentPageUrl !== "/forgot-password/sent" &&
          currentPageUrl !== "/reset-password" &&
          currentPageUrl !== "/reset-password/success" &&
          !get().isFirstMount
        ) {
          window.location.replace("/");
        }
      }
    },
  } satisfies Session["actions"],
}));

export const useSession = <TResult>(selector: SelectorFn<Session, TResult>) => {
  const state = useInitSession(useShallow(selector));

  return state;
};
