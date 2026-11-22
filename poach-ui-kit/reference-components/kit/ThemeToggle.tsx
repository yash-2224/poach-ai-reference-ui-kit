import { MoonStarsIcon, SunIcon } from "@phosphor-icons/react";
import { toggleTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * One-tap light/dark switch. Shows the current theme's icon (sun = light,
 * moon = dark); tapping flips the whole app with a circular reveal from the
 * button while the icons rotate and de-blur into each other. No popup.
 */
export function ThemeToggle({ tone = "band", className }: { tone?: "band" | "plain"; className?: string }) {
  const theme = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className={cn(
        "relative grid size-9 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-xl transition-[background-color,color,transform] duration-200 active:scale-[0.94]",
        tone === "band"
          ? "text-band-muted hover:bg-band-foreground/10 hover:text-band-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <SunIcon
        weight="duotone"
        className={cn(
          "theme-icon absolute size-[19px]",
          // Driven by the `.dark` class (not React state) so the right icon shows even before the page finishes loading.
          "rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-50 dark:opacity-0 dark:[filter:blur(3px)]",
        )}
      />
      <MoonStarsIcon
        weight="duotone"
        className={cn(
          "theme-icon absolute size-[19px]",
          "rotate-90 scale-50 opacity-0 [filter:blur(3px)] dark:rotate-0 dark:scale-100 dark:opacity-100 dark:[filter:none]",
        )}
      />
    </button>
  );
}
