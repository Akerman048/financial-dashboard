import { create } from "zustand";
import type { User } from "firebase/auth";

type AuthStore = {
  user: User | null;
  isAuthModalOpen: boolean;
  setUser: (user: User | null) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthModalOpen: false,
  setUser: (user) => set({ user }),
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));