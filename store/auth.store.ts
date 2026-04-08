import { create } from "zustand";
import type { User } from "firebase/auth";

type AuthStore = {
  user: User | null;
  isAuthModalOpen: boolean;
  authInitialized: boolean;
  setUser: (user: User | null) => void;
  setAuthInitialized: (value: boolean) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthModalOpen: false,
  authInitialized: false,

  setUser: (user) => set({ user }),
  setAuthInitialized: (value) => set({ authInitialized: value }),

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
