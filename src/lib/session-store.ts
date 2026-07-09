import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type HistoryEntry = {
  id: string;
  type: "Email" | "Research" | "Chat" | "Document";
  title: string;
  content: string;
  createdAt: number;
};

type SessionState = {
  history: HistoryEntry[];
  addHistory: (e: Omit<HistoryEntry, "id" | "createdAt">) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
  sessionStart: number;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      history: [],
      sessionStart: Date.now(),
      addHistory: (e) =>
        set((s) => ({
          history: [
            { ...e, id: crypto.randomUUID(), createdAt: Date.now() },
            ...s.history,
          ].slice(0, 100),
        })),
      removeHistory: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "awpa-session",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? sessionStorage : (undefined as unknown as Storage),
      ),
    },
  ),
);

export type Preferences = {
  theme: "light" | "dark" | "system";
  responseLength: "Short" | "Medium" | "Long";
  creativity: number;
  language: string;
  defaultEmailTone: "Formal" | "Friendly" | "Persuasive";
  animations: boolean;
};

type PrefState = Preferences & {
  setPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  reset: () => void;
};

const defaults: Preferences = {
  theme: "system",
  responseLength: "Medium",
  creativity: 0.7,
  language: "English",
  defaultEmailTone: "Formal",
  animations: true,
};

export const usePreferences = create<PrefState>()(
  persist(
    (set) => ({
      ...defaults,
      setPref: (k, v) => set({ [k]: v } as Partial<Preferences>),
      reset: () => set(defaults),
    }),
    { name: "awpa-prefs" },
  ),
);