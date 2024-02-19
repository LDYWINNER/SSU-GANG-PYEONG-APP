import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IDarkMode } from "../types";

interface IDarkModeStore {
  isDarkMode: IDarkMode | null;
  updateDarkMode: (isDarkMode: IDarkMode | null) => void;
}

const useDarkMode = create<IDarkModeStore>()(
  persist(
    (set, get) => ({
      isDarkMode: null,
      updateDarkMode: (isDarkMode) => {
        set({
          isDarkMode,
        });
      },
    }),
    {
      name: "ssu-gang-pyeong-dark-mode-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useDarkMode;
