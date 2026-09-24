import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Language } from "@/types/learning";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Global store for the learner's selected language.
// Persisted to AsyncStorage so the choice survives app restarts.
type LanguageState = {
  // The chosen language, or null if the user hasn't picked one yet.
  selectedLanguage: Language | null;
  // True once the persisted value has finished loading from AsyncStorage.
  // We wait for this before deciding where to route the user.
  hasHydrated: boolean;
  setLanguage: (language: Language) => void;
  clearLanguage: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: null,
      hasHydrated: false,
      setLanguage: (language) => set({ selectedLanguage: language }),
      clearLanguage: () => set({ selectedLanguage: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "lingua-selected-language",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the language itself, not the hydration flag.
      partialize: (state) => ({ selectedLanguage: state.selectedLanguage }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
