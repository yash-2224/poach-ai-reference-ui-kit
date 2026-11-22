import { Toaster as Sonner } from "sonner";
import {
  CheckIcon,
  InfoIcon,
  WarningIcon,
  XIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react";
import { useIsMobile } from "@/hooks/use-mobile";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/** Tinted, engraved icon chip used inside every toast. */
function Chip({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`grid size-8 shrink-0 place-items-center rounded-full ${className}`}>{children}</span>
  );
}

/**
 * Poach notifications: white engraved cards with a tinted status chip,
 * stacked bottom-right on desktop and top-center on phones.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const isMobile = useIsMobile();
  return (
    <Sonner
      className="toaster group"
      position={isMobile ? "top-center" : "bottom-right"}
      offset={isMobile ? 12 : 20}
      gap={10}
      visibleToasts={4}
      duration={3600}
      icons={{
        success: (
          <Chip className="bg-success-soft text-success">
            <CheckIcon weight="bold" className="size-4" />
          </Chip>
        ),
        error: (
          <Chip className="bg-destructive-soft text-destructive">
            <XIcon weight="bold" className="size-4" />
          </Chip>
        ),
        warning: (
          <Chip className="bg-warning-soft text-warning-foreground">
            <WarningIcon weight="fill" className="size-4" />
          </Chip>
        ),
        info: (
          <Chip className="bg-primary-soft text-primary">
            <InfoIcon weight="fill" className="size-4" />
          </Chip>
        ),
        loading: (
          <Chip className="bg-muted text-muted-foreground">
            <CircleNotchIcon weight="bold" className="size-4 animate-spin" />
          </Chip>
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "poach-toast group/toast pointer-events-auto flex w-full items-center gap-3 rounded-2xl bg-card py-3 pr-4 pl-3 font-sans text-foreground shadow-float sm:w-[360px]",
          icon: "!m-0 !size-8 shrink-0 [&>*]:!m-0",
          content: "min-w-0 flex-1",
          title: "text-[13.5px] leading-snug font-semibold",
          description: "mt-0.5 text-[12.5px] leading-snug text-muted-foreground",
          actionButton:
            "!ml-auto shrink-0 cursor-pointer rounded-lg bg-ink px-2.5 py-1.5 text-[12px] font-medium text-ink-foreground",
          cancelButton:
            "shrink-0 cursor-pointer rounded-lg bg-muted px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground",
          closeButton: "!bg-card !shadow-engraved !border-0",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
