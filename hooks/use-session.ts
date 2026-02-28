import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  sessionId: string;
}

export const useSessionStore = create<SessionState>()(
  persist(
    () => ({
      sessionId: Math.random().toString(36).substring(2, 15),
    }),
    {
      name: "bait-els3ada-session",
    },
  ),
);
