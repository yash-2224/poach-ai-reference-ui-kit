import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  CalendarBlankIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CheckIcon,
  CircleNotchIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  GearSixIcon,
  LightningIcon,
  LinkSimpleIcon,
  PaperPlaneTiltIcon,
  PauseIcon,
  PencilSimpleIcon,
  PhoneIcon,
  PlayIcon,
  QuestionIcon,
  ShieldCheckIcon,
  SparkleIcon,
  TagIcon,
  TargetIcon,
  TrashIcon,
  UserIcon,
  UsersThreeIcon,
  WarningIcon,
  XCircleIcon,
  type Icon,
} from "@phosphor-icons/react";
import { AvaMarkdown } from "./AvaMarkdown";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  initialCardValues,
  missingCardFields,
  type AvaCard,
  type AvaCardAction,
  type AvaCardField,
  type AvaCardIcon,
  type AvaCardTone,
} from "@/lib/ava-cards";
import { cn } from "@/lib/utils";

/* ---------- Fixed vocabulary → visuals ---------- */

const ICONS: Record<AvaCardIcon, Icon> = {
  sparkle: SparkleIcon,
  send: PaperPlaneTiltIcon,
  pause: PauseIcon,
  play: PlayIcon,
  calendar: CalendarBlankIcon,
  clock: ClockIcon,
  mail: EnvelopeSimpleIcon,
  user: UserIcon,
  users: UsersThreeIcon,
  chart: ChartBarIcon,
  warning: WarningIcon,
  bolt: LightningIcon,
  file: FileTextIcon,
  trash: TrashIcon,
  gear: GearSixIcon,
  question: QuestionIcon,
  check: CheckCircleIcon,
  tag: TagIcon,
  link: LinkSimpleIcon,
  phone: PhoneIcon,
  target: TargetIcon,
  shield: ShieldCheckIcon,
  pencil: PencilSimpleIcon,
  money: CurrencyDollarIcon,
};

const TONES: Record<
  AvaCardTone,
  { tile: string; eyebrow: string; wash: string; ring: string; bar: string }
> = {
  blue: {
    tile: "bg-primary-soft text-primary",
    eyebrow: "text-primary",
    wash: "from-primary-soft/70",
    ring: "ring-primary/15",
    bar: "bg-primary",
  },
  green: {
    tile: "bg-success-soft text-success",
    eyebrow: "text-success",
    wash: "from-success-soft/70",
    ring: "ring-success/20",
    bar: "bg-success",
  },
  amber: {
    tile: "bg-warning-soft text-warning-foreground",
    eyebrow: "text-warning-foreground",
    wash: "from-warning-soft/70",
    ring: "ring-warning/25",
    bar: "bg-warning",
  },
  red: {
    tile: "bg-destructive-soft text-destructive",
    eyebrow: "text-destructive",
    wash: "from-destructive-soft/70",
    ring: "ring-destructive/20",
    bar: "bg-destructive",
  },
  neutral: {
    tile: "bg-muted text-secondary-foreground",
    eyebrow: "text-muted-foreground",
    wash: "from-muted/80",
    ring: "ring-border",
    bar: "bg-foreground/60",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

function Collapse({
  show,
  children,
  className,
}: {
  show: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className={cn("overflow-hidden", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Card ---------- */

export function AvaCardView({
  card,
  onAction,
}: {
  card: AvaCard;
  /** Parent decides what happens (run / reply / dismiss / link) and updates the card status. */
  onAction: (action: AvaCardAction, values: Record<string, string>) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => initialCardValues(card));
  const [touched, setTouched] = useState(false);
  const [armed, setArmed] = useState<string | null>(null);
  const armTimer = useRef<number | undefined>(undefined);
  const tone = TONES[card.tone];
  const CardIcon = ICONS[card.icon];
  const { status } = card;
  const open = status === "open";
  const working = status === "working";
  const done = status === "done";
  const dismissed = status === "dismissed";
  const missing = missingCardFields(card, values);

  // Steps tick off one by one while Ava works.
  const stepCount = card.steps?.length ?? 0;
  const [progress, setProgress] = useState(done ? stepCount : 0);
  useEffect(() => {
    if (done) return setProgress(stepCount);
    if (!working) return setProgress(0);
    setProgress(0);
    const id = window.setInterval(() => setProgress((p) => Math.min(stepCount - 1, p + 1)), 380);
    return () => window.clearInterval(id);
  }, [working, done, stepCount]);

  useEffect(() => () => window.clearTimeout(armTimer.current), []);

  const press = (a: AvaCardAction) => {
    if (!open) return;
    const validates =
      (a.effect === "reply" || a.effect === "run") && (card.fields?.length ?? 0) > 0;
    if (validates && missing.length) {
      setTouched(true);
      return;
    }
    if (a.confirm && armed !== a.id) {
      setArmed(a.id);
      window.clearTimeout(armTimer.current);
      armTimer.current = window.setTimeout(() => setArmed(null), 3500);
      return;
    }
    setArmed(null);
    onAction(a, values);
  };

  // Primary/danger last → rightmost on desktop, top on phone (column-reverse).
  const rank = { ghost: 0, secondary: 1, primary: 2, danger: 2 } as const;
  const actions = [...card.actions].sort((a, b) => rank[a.style] - rank[b.style]);
  const pressed = card.actions.find((a) => a.id === card.result?.actionId);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: dismissed ? 0.82 : 1 }}
      className={cn(
        "relative min-w-0 overflow-hidden rounded-[22px] bg-card shadow-engraved ring-1 transition-[box-shadow] duration-300",
        open || working ? tone.ring : "ring-transparent",
      )}
    >
      {/* Thin progress line while working */}
      <AnimatePresence>
        {working && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-0 h-[2px] overflow-hidden bg-muted"
          >
            <span
              className={cn("ava-card-progress absolute inset-y-0 w-1/3 rounded-full", tone.bar)}
            />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative px-4 pt-4 pb-3.5 sm:px-5">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent",
            tone.wash,
          )}
        />
        <div className="relative flex items-start gap-3">
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-[14px] shadow-[inset_0_1px_0_oklch(1_0_0/0.5),inset_0_0_0_1px_oklch(0_0_0/0.04)]",
              done
                ? "bg-success-soft text-success"
                : dismissed
                  ? "bg-muted text-muted-foreground"
                  : tone.tile,
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={done ? "done" : dismissed ? "x" : "icon"}
                initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.26, ease: EASE }}
                className="grid place-items-center"
              >
                {done ? (
                  <CheckIcon weight="bold" className="size-[19px]" />
                ) : dismissed ? (
                  <XCircleIcon weight="duotone" className="size-5" />
                ) : (
                  <CardIcon weight="duotone" className="size-5" />
                )}
              </motion.span>
            </AnimatePresence>
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex min-h-5 items-center justify-between gap-2">
              {card.eyebrow ? (
                <span
                  className={cn(
                    "truncate text-[10.5px] font-semibold tracking-[0.09em] uppercase",
                    dismissed ? "text-muted-foreground" : tone.eyebrow,
                  )}
                >
                  {card.eyebrow}
                </span>
              ) : (
                <span />
              )}
              <StatusChip status={status} />
            </div>
            <h4
              className={cn(
                "mt-0.5 font-display text-[15px] leading-snug font-semibold tracking-[-0.005em] [overflow-wrap:anywhere]",
                dismissed && "text-muted-foreground",
              )}
            >
              {card.title}
            </h4>
            {card.description && (
              <Collapse show={!dismissed}>
                <AvaMarkdown
                  text={card.description}
                  className="mt-1 text-[13px] leading-relaxed text-muted-foreground [&_p]:my-0"
                />
              </Collapse>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <Collapse show={!dismissed}>
        <div className="space-y-4 px-4 pb-4 sm:px-5">
          {card.stats && <Stats stats={card.stats} />}
          {card.preview && <Preview preview={card.preview} />}
          {card.steps && (
            <Steps
              steps={card.steps}
              label={card.stepsLabel}
              progress={progress}
              working={working}
              done={done}
            />
          )}
          {card.fields && (
            <>
              <Collapse show={open || working}>
                <Fields
                  fields={card.fields}
                  values={values}
                  touched={touched}
                  disabled={!open}
                  onChange={(id, v) => setValues((x) => ({ ...x, [id]: v }))}
                />
              </Collapse>
              <Collapse show={done}>
                <Summary fields={card.fields} values={card.result?.values ?? values} />
              </Collapse>
            </>
          )}
        </div>
      </Collapse>

      {/* Footer */}
      <div className="border-t border-border/70 bg-muted/30 px-4 py-3 sm:px-5">
        <AnimatePresence mode="wait" initial={false}>
          {open || working ? (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, filter: "blur(3px)" }}
              transition={{ duration: 0.2, ease: EASE }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="flex min-w-0 items-center gap-1.5 text-[11.5px] text-muted-foreground">
                {touched && missing.length > 0 ? (
                  <span className="flex items-center gap-1.5 text-destructive">
                    <WarningIcon weight="fill" className="size-3.5 shrink-0" />
                    Fill in{" "}
                    {missing.length === 1
                      ? missing[0]!.label.toLowerCase()
                      : `${missing.length} required fields`}{" "}
                    to continue
                  </span>
                ) : (
                  <>
                    <ShieldCheckIcon weight="duotone" className="size-3.5 shrink-0 text-success" />
                    <span className="truncate">
                      {card.footnote ?? "Nothing happens until you choose"}
                    </span>
                  </>
                )}
              </p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                {actions.map((a) => (
                  <CardButton
                    key={a.id}
                    action={a}
                    armed={armed === a.id}
                    busy={working && card.result?.actionId === a.id}
                    disabled={working}
                    onClick={() => press(a)}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.28, ease: EASE }}
              className="flex min-w-0 items-center justify-between gap-3 text-[12.5px]"
            >
              <span
                className={cn(
                  "flex min-w-0 items-center gap-2 font-medium",
                  done ? "text-success" : "text-muted-foreground",
                )}
              >
                {done ? (
                  <CheckCircleIcon weight="fill" className="size-4 shrink-0" />
                ) : (
                  <XCircleIcon weight="fill" className="size-4 shrink-0" />
                )}
                <span className="truncate">
                  {card.result?.label ??
                    pressed?.doneLabel ??
                    (done ? "Done" : "Nothing was changed")}
                </span>
              </span>
              {card.result?.at && (
                <span className="tabular shrink-0 text-[11px] text-muted-foreground">
                  {card.result.at}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ---------- Pieces ---------- */

function StatusChip({ status }: { status: AvaCard["status"] }) {
  const map = {
    open: {
      label: "Waiting for you",
      cls: "bg-warning-soft text-warning-foreground",
      dot: "bg-warning",
    },
    working: { label: "Working", cls: "bg-primary-soft text-accent-foreground", dot: "bg-primary" },
    done: { label: "Done", cls: "bg-success-soft text-success-foreground", dot: "bg-success" },
    dismissed: {
      label: "Skipped",
      cls: "bg-muted text-muted-foreground",
      dot: "bg-muted-foreground",
    },
  }[status];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.18 }}
        className={cn(
          "inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-full px-2 text-[11px] font-medium",
          map.cls,
        )}
      >
        {status === "working" ? (
          <CircleNotchIcon weight="bold" className="size-3 animate-spin" />
        ) : (
          <span
            className={cn("size-1.5 rounded-full", map.dot, status === "open" && "animate-pulse")}
          />
        )}
        {map.label}
      </motion.span>
    </AnimatePresence>
  );
}

function Stats({ stats }: { stats: NonNullable<AvaCard["stats"]> }) {
  return (
    <div
      className={cn(
        "grid gap-2",
        stats.length === 1 ? "grid-cols-1" : stats.length === 3 ? "grid-cols-3" : "grid-cols-2",
        stats.length >= 4 && "sm:grid-cols-4",
      )}
    >
      {stats.map((s) => (
        <div key={s.label} className="well min-w-0 rounded-xl px-3 py-2.5">
          <p className="truncate text-[11px] font-medium text-muted-foreground">{s.label}</p>
          <p className="mt-0.5 flex items-baseline gap-1">
            <span className="tabular truncate text-[17px] leading-tight font-semibold">
              {s.value}
            </span>
            {s.trend === "up" && (
              <ArrowUpRightIcon weight="bold" className="size-3 shrink-0 text-success" />
            )}
            {s.trend === "down" && (
              <ArrowDownRightIcon weight="bold" className="size-3 shrink-0 text-destructive" />
            )}
          </p>
          {s.hint && <p className="truncate text-[10.5px] text-muted-foreground">{s.hint}</p>}
        </div>
      ))}
    </div>
  );
}

function Preview({ preview }: { preview: NonNullable<AvaCard["preview"]> }) {
  const meta = [
    preview.from && ["From", preview.from],
    preview.to && ["To", preview.to],
    preview.subject && ["Subject", preview.subject],
  ].filter(Boolean) as [string, string][];
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
        {preview.label ?? "Draft"}
      </p>
      <div className="relative overflow-hidden rounded-2xl bg-muted/45 shadow-[inset_0_0_0_1px_var(--hairline)]">
        <span
          aria-hidden
          className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-primary/50"
        />
        {meta.length > 0 && (
          <dl className="space-y-0.5 border-b border-border/60 px-4 py-2.5 text-[12px]">
            {meta.map(([k, v]) => (
              <div key={k} className="flex min-w-0 gap-2">
                <dt className="w-14 shrink-0 text-muted-foreground">{k}</dt>
                <dd className="min-w-0 truncate font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        <AvaMarkdown
          text={preview.body}
          className="px-4 py-3 text-[13px] leading-relaxed text-secondary-foreground [&_p]:my-1.5 first:[&_p]:mt-0"
        />
      </div>
    </div>
  );
}

function Steps({
  steps,
  label,
  progress,
  working,
  done,
}: {
  steps: string[];
  label?: string | undefined;
  progress: number;
  working: boolean;
  done: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
        {label ?? (done ? "What Ava did" : "What Ava will do")}
      </p>
      <ol className="relative">
        {steps.map((s, i) => {
          const complete = done || (working && i < progress);
          const current = working && i === progress;
          const last = i === steps.length - 1;
          return (
            <li key={i} className="relative flex gap-3 pb-2.5 last:pb-0">
              {!last && (
                <span aria-hidden className="absolute top-6 bottom-0 left-[11px] w-px bg-border">
                  <motion.span
                    className="absolute inset-x-0 top-0 bg-success"
                    initial={false}
                    animate={{ height: complete ? "100%" : "0%" }}
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                </span>
              )}
              <span
                className={cn(
                  "tabular relative z-[1] grid size-[23px] shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-colors duration-300",
                  complete
                    ? "bg-success text-success-foreground"
                    : current
                      ? "bg-primary-soft text-primary"
                      : "well text-muted-foreground",
                )}
              >
                {complete ? (
                  <motion.span
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.22, ease: EASE }}
                  >
                    <CheckIcon weight="bold" className="size-3" />
                  </motion.span>
                ) : current ? (
                  <CircleNotchIcon weight="bold" className="size-3 animate-spin" />
                ) : (
                  i + 1
                )}
              </span>
              <AvaMarkdown
                text={s}
                className={cn(
                  "min-w-0 pt-[2px] text-[13px] leading-relaxed transition-colors [&_p]:my-0",
                  complete ? "text-muted-foreground" : "text-secondary-foreground",
                )}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const WIDE = new Set(["textarea", "chips", "multichips", "tiles", "toggle", "slider"]);

function Fields({
  fields,
  values,
  touched,
  disabled,
  onChange,
}: {
  fields: AvaCardField[];
  values: Record<string, string>;
  touched: boolean;
  disabled: boolean;
  onChange: (id: string, v: string) => void;
}) {
  return (
    <div className="grid gap-x-3 gap-y-4 pt-0.5 sm:grid-cols-2">
      {fields.map((f) => {
        const bad = touched && !!f.required && !values[f.id]?.trim();
        return (
          <div key={f.id} className={cn("min-w-0", WIDE.has(f.type) && "sm:col-span-2")}>
            {f.type !== "toggle" && (
              <label
                htmlFor={`ava-f-${f.id}`}
                className="mb-1.5 flex items-baseline justify-between gap-2 text-[12px] font-medium text-secondary-foreground"
              >
                <span>
                  {f.label}
                  {f.required && <span className="text-destructive"> *</span>}
                </span>
                {f.type === "slider" && (
                  <span className="tabular text-[13px] font-semibold text-foreground">
                    {values[f.id]}
                    {f.suffix}
                  </span>
                )}
              </label>
            )}
            <FieldControl
              f={f}
              value={values[f.id] ?? ""}
              bad={bad}
              disabled={disabled}
              onChange={(v) => onChange(f.id, v)}
            />
            {bad ? (
              <p className="mt-1 text-[11.5px] text-destructive">Ava needs this to continue</p>
            ) : (
              f.hint &&
              f.type !== "toggle" && (
                <p className="mt-1 text-[11.5px] text-muted-foreground">{f.hint}</p>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldControl({
  f,
  value,
  bad,
  disabled,
  onChange,
}: {
  f: AvaCardField;
  value: string;
  bad: boolean;
  disabled: boolean;
  onChange: (v: string) => void;
}) {
  const id = `ava-f-${f.id}`;
  switch (f.type) {
    case "chips":
    case "multichips": {
      const multi = f.type === "multichips";
      const picked = multi
        ? value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [value];
      return (
        <div
          id={id}
          role={multi ? "group" : "radiogroup"}
          aria-label={f.label}
          className="flex flex-wrap gap-1.5"
        >
          {f.options?.map((o) => {
            const on = picked.includes(o);
            return (
              <button
                key={o}
                type="button"
                role={multi ? "checkbox" : "radio"}
                aria-checked={on}
                disabled={disabled}
                onClick={() =>
                  onChange(
                    multi ? (on ? picked.filter((p) => p !== o) : [...picked, o]).join(", ") : o,
                  )
                }
                className={cn(
                  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-medium transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.97] disabled:cursor-default",
                  on
                    ? "bg-primary text-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.2),0_0_0_1px_var(--color-primary)]"
                    : "bg-card shadow-engraved hover:bg-muted/60",
                  bad && !on && "ring-1 ring-destructive/40",
                )}
              >
                {multi && on && <CheckIcon weight="bold" className="size-3" />}
                {o}
              </button>
            );
          })}
        </div>
      );
    }
    case "tiles":
      return (
        <div id={id} role="radiogroup" aria-label={f.label} className="grid gap-2 sm:grid-cols-2">
          {f.choices?.map((c) => {
            const on = value === c.id;
            const TileIcon = c.icon ? ICONS[c.icon] : null;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={disabled}
                onClick={() => onChange(c.id)}
                className={cn(
                  "relative flex min-w-0 cursor-pointer items-start gap-3 rounded-2xl p-3 text-left transition-[background-color,box-shadow,transform] duration-200 active:scale-[0.99] disabled:cursor-default",
                  on
                    ? "bg-primary-soft/60 shadow-[inset_0_0_0_1.5px_var(--color-primary)]"
                    : "bg-card shadow-engraved hover:bg-muted/50",
                  bad && !on && "ring-1 ring-destructive/40",
                )}
              >
                {TileIcon && (
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-[10px] transition-colors",
                      on
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-secondary-foreground",
                    )}
                  >
                    <TileIcon weight="duotone" className="size-[17px]" />
                  </span>
                )}
                <span className="min-w-0 flex-1 pr-5">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[13px] font-semibold">{c.label}</span>
                    {c.badge && (
                      <span className="rounded-full bg-success-soft px-1.5 py-px text-[10px] font-semibold text-success-foreground">
                        {c.badge}
                      </span>
                    )}
                  </span>
                  {c.description && (
                    <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">
                      {c.description}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "absolute top-3 right-3 grid size-[18px] place-items-center rounded-full transition-all duration-200",
                    on
                      ? "scale-100 bg-primary text-primary-foreground"
                      : "scale-90 shadow-[inset_0_0_0_1.5px_var(--color-border-strong)]",
                  )}
                >
                  {on && <CheckIcon weight="bold" className="size-2.5" />}
                </span>
              </button>
            );
          })}
        </div>
      );
    case "toggle":
      return (
        <label
          htmlFor={id}
          className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-muted/40 px-3.5 py-2.5 shadow-[inset_0_0_0_1px_var(--hairline)]"
        >
          <span className="min-w-0">
            <span className="block text-[13px] font-medium">{f.label}</span>
            {f.hint && <span className="block text-[11.5px] text-muted-foreground">{f.hint}</span>}
          </span>
          <Switch
            id={id}
            checked={value === "Yes"}
            disabled={disabled}
            onCheckedChange={(on) => onChange(on ? "Yes" : "No")}
          />
        </label>
      );
    case "slider":
      return (
        <div className="px-0.5 pt-1.5">
          <Slider
            id={id}
            min={f.min ?? 0}
            max={f.max ?? 100}
            step={f.step ?? 1}
            value={[Number(value) || (f.min ?? 0)]}
            disabled={disabled}
            onValueChange={(v) => onChange(String(v[0] ?? 0))}
          />
          <div className="tabular mt-1.5 flex justify-between text-[10.5px] text-muted-foreground">
            <span>
              {f.min ?? 0}
              {f.suffix}
            </span>
            <span>
              {f.max ?? 100}
              {f.suffix}
            </span>
          </div>
        </div>
      );
    case "select":
      return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger id={id} className="h-10" aria-invalid={bad}>
            <SelectValue placeholder={f.placeholder ?? "Choose…"} />
          </SelectTrigger>
          <SelectContent>
            {f.options?.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "textarea":
      return (
        <Textarea
          id={id}
          rows={2}
          value={value}
          placeholder={f.placeholder}
          disabled={disabled}
          aria-invalid={bad}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    default:
      return (
        <Input
          id={id}
          type={f.type === "text" ? "text" : f.type}
          value={value}
          min={f.min}
          max={f.max}
          step={f.step}
          placeholder={f.placeholder}
          disabled={disabled}
          aria-invalid={bad}
          onChange={(e) => onChange(e.target.value)}
          className="h-10"
        />
      );
  }
}

function Summary({ fields, values }: { fields: AvaCardField[]; values: Record<string, string> }) {
  const rows = fields
    .map((f) => {
      const raw = values[f.id];
      if (!raw) return null;
      const shown =
        f.type === "tiles"
          ? (f.choices?.find((c) => c.id === raw)?.label ?? raw)
          : `${raw}${f.type === "slider" && f.suffix ? f.suffix : ""}`;
      return { f, shown };
    })
    .filter((r): r is { f: AvaCardField; shown: string } => !!r);
  if (!rows.length) return null;
  return (
    <dl className="grid gap-x-4 gap-y-2 rounded-xl bg-muted/40 px-3.5 py-3 text-[12.5px] shadow-[inset_0_0_0_1px_var(--hairline)] sm:grid-cols-2">
      {rows.map(({ f, shown }) => (
        <div key={f.id} className="min-w-0">
          <dt className="truncate text-[11px] text-muted-foreground">{f.label}</dt>
          <dd className="truncate font-medium">{shown}</dd>
        </div>
      ))}
    </dl>
  );
}

function CardButton({
  action,
  armed,
  busy,
  disabled,
  onClick,
}: {
  action: AvaCardAction;
  armed: boolean;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const BtnIcon = action.icon ? ICONS[action.icon] : null;
  const styles = {
    primary:
      "bg-primary-gradient text-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.2),0_0_0_1px_oklch(0.4_0.16_263),0_2px_6px_-2px_oklch(0.4_0.16_263/0.45)] hover:opacity-[0.93]",
    danger: armed
      ? "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.18)]"
      : "bg-destructive-soft text-destructive shadow-[inset_0_0_0_1px_oklch(0.6_0.19_25/0.2)] hover:bg-destructive-soft/70",
    secondary: "bg-card text-foreground shadow-engraved hover:bg-muted/60",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  }[action.style];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-xl px-4 text-[13px] font-medium whitespace-nowrap transition-[background-color,box-shadow,transform,color,opacity] duration-200 active:scale-[0.97] focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none disabled:cursor-default disabled:opacity-55 sm:h-8 sm:px-3.5",
        styles,
        armed && action.style !== "danger" && "ring-2 ring-primary/30",
      )}
    >
      {busy ? (
        <CircleNotchIcon weight="bold" className="size-4 animate-spin" />
      ) : action.effect === "link" ? (
        <ArrowUpRightIcon weight="bold" className="size-3.5" />
      ) : (
        BtnIcon && (
          <BtnIcon weight={action.style === "primary" ? "fill" : "duotone"} className="size-4" />
        )
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={armed ? "armed" : "idle"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
        >
          {armed ? "Tap again to confirm" : action.label}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
