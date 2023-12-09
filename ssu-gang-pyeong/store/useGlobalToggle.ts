import { IGlobalToggle } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IUserGlobalStore {
  toggleInfo: IGlobalToggle | null;
  updateToggleInfo: (user: IGlobalToggle | null) => void;
}

const useGlobalToggle = create<IUserGlobalStore>()(
  persist(
    (set, get) => ({
      toggleInfo: null,
      updateToggleInfo: (toggleInfo) => {
        set({
          toggleInfo,
        });
      },
    }),
    {
      name: "ssu-gang-pyeong-toggle-info-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useGlobalToggle;
