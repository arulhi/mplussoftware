import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  // token: string | null;
  // isHydrated: boolean; // Untuk mengetahui apakah store sudah dihydrate
  // setToken: (token: string | null) => void;
  // clearToken: () => void;
  // setHydrated: (hydrated: boolean) => void;
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // token: Cookies.get("auth-token") || null, // Ambil token dari cookie saat init
  // isHydrated: false,
  isAuthenticated: false,
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),

  // setToken: (token) => {
  //   if (token) {
  //     Cookies.set("auth-token", token, {
  //       expires: 7, // Token berlaku selama 7 hari
  //       secure: process.env.NODE_ENV === "production", // Hanya secure di production
  //       sameSite: "Strict",
  //     });
  //   } else {
  //     Cookies.remove("auth-token");
  //   }
  //   set({ token });
  // },

  // clearToken: () => {
  //   Cookies.remove("auth-token");
  //   set({ token: null });
  // },

  // setHydrated: (hydrated) => set({ isHydrated: hydrated }),
}));
