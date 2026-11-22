import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[72px] w-full rounded-xl bg-card px-3.5 py-2.5 text-sm shadow-engraved transition-shadow duration-200 placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--color-ring),0_0_0_4px_oklch(0.6_0.13_262/0.14)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
