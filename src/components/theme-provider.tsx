import { useEffect } from "react";
import { usePreferences } from "@/lib/session-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = usePreferences((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", isDark);
    };
    apply();
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);
  return <>{children}</>;
}