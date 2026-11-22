/**
 * Ava interactive cards — the ONE way Ava asks for approval, details or a choice.
 *
 * Ava (the AI backend) never writes UI code. She sends a small JSON object
 * (`AvaCard`) using the fixed vocabulary below — icons, tones, field types and
 * button styles are all pre-built. The UI renders it in one consistent style
 * (`src/components/ava/AvaCard.tsx`).
 *
 * Everything coming from the AI goes through `normalizeAvaCard`, which drops
 * unknown values, fills defaults and clamps sizes, so a sloppy or partial
 * payload can never break the chat.
 *
 * Example payload Ava can send:
 * {
 *   "tone": "blue", "icon": "send", "eyebrow": "Needs approval",
 *   "title": "Send a nudge to Priya",
 *   "stats": [{ "label": "Opens (1h)", "value": "7" }],
 *   "steps": ["Reply in the existing thread", "Pause the Day 6 follow-up"],
 *   "actions": [
 *     { "id": "send", "label": "Send nudge", "style": "primary", "icon": "send", "doneLabel": "Nudge sent" },
 *     { "id": "later", "label": "Not now", "style": "ghost", "effect": "dismiss" }
 *   ]
 * }
 */
import type { AssistantMessage } from "./types";

export const AVA_CARD_TONES = ["blue", "green", "amber", "red", "neutral"] as const;
export type AvaCardTone = (typeof AVA_CARD_TONES)[number];

export const AVA_CARD_ICONS = [
  "sparkle",
  "send",
  "pause",
  "play",
  "calendar",
  "clock",
  "mail",
  "user",
  "users",
  "chart",
  "warning",
  "bolt",
  "file",
  "trash",
  "gear",
  "question",
  "check",
  "tag",
  "link",
  "phone",
  "target",
  "shield",
  "pencil",
  "money",
] as const;
export type AvaCardIcon = (typeof AVA_CARD_ICONS)[number];

export const AVA_FIELD_TYPES = [
  "text",
  "textarea",
  "email",
  "number",
  "date",
  "time",
  "select",
  "chips",
  "multichips",
  "tiles",
  "toggle",
  "slider",
] as const;
export type AvaFieldType = (typeof AVA_FIELD_TYPES)[number];

export const AVA_ACTION_STYLES = ["primary", "secondary", "ghost", "danger"] as const;
export type AvaActionStyle = (typeof AVA_ACTION_STYLES)[number];

/**
 * What pressing a button does:
 * - `run`     Ava carries out the change (card shows progress → done)
 * - `reply`   the filled-in answers go back to Ava, who replies in chat
 * - `dismiss` closes the card, nothing changes
 * - `link`    opens `href` (in-app path or external URL), card stays open
 */
export const AVA_ACTION_EFFECTS = ["run", "reply", "dismiss", "link"] as const;
export type AvaActionEffect = (typeof AVA_ACTION_EFFECTS)[number];

export interface AvaCardChoice {
  id: string;
  label: string;
  description?: string | undefined;
  icon?: AvaCardIcon | undefined;
  /** Small tag on the tile, e.g. "Best reply rate". */
  badge?: string | undefined;
}

export interface AvaCardField {
  id: string;
  label: string;
  type: AvaFieldType;
  /** Options for select / chips / multichips. */
  options?: string[] | undefined;
  /** Rich options for `tiles`. */
  choices?: AvaCardChoice[] | undefined;
  placeholder?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
  /** Pre-filled value (multichips: comma-separated; toggle: "Yes" / "No"). */
  value?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  /** Shown after slider / number values, e.g. "%", "days". */
  suffix?: string | undefined;
}

export interface AvaCardAction {
  id: string;
  label: string;
  style: AvaActionStyle;
  effect: AvaActionEffect;
  icon?: AvaCardIcon | undefined;
  href?: string | undefined;
  /** Ask for a second press before acting (deletes, bulk pauses). */
  confirm?: boolean | undefined;
  /** Result line once finished, e.g. "Nudge sent". */
  doneLabel?: string | undefined;
}

export interface AvaCardStat {
  label: string;
  value: string;
  trend?: "up" | "down" | undefined;
  hint?: string | undefined;
}

/** A quoted draft (email / message) shown inside the card. */
export interface AvaCardPreview {
  label?: string | undefined;
  from?: string | undefined;
  to?: string | undefined;
  subject?: string | undefined;
  body: string;
}

export type AvaCardStatus = "open" | "working" | "done" | "dismissed";

export interface AvaCard {
  tone: AvaCardTone;
  icon: AvaCardIcon;
  /** Small label above the title, e.g. "Needs approval", "Quick question". */
  eyebrow?: string | undefined;
  title: string;
  /** Markdown, one or two short sentences. */
  description?: string | undefined;
  stats?: AvaCardStat[] | undefined;
  /** Markdown lines — "what I'll do". */
  steps?: string[] | undefined;
  stepsLabel?: string | undefined;
  preview?: AvaCardPreview | undefined;
  fields?: AvaCardField[] | undefined;
  actions: AvaCardAction[];
  /** Small reassurance line, e.g. "Nothing is sent until you approve". */
  footnote?: string | undefined;
  status: AvaCardStatus;
  result?:
    | {
        actionId: string;
        label: string;
        values?: Record<string, string> | undefined;
        at?: string | undefined;
      }
    | undefined;
}

/* ---------- Limits (keep cards short and unbreakable) ---------- */

export const AVA_CARD_LIMITS = {
  title: 80,
  eyebrow: 28,
  label: 32,
  description: 400,
  stats: 4,
  steps: 6,
  fields: 8,
  options: 8,
  choices: 4,
  actions: 3,
} as const;

/* ---------- Normalizer ---------- */

type RawKey =
  | "title"
  | "label"
  | "type"
  | "options"
  | "choices"
  | "id"
  | "description"
  | "icon"
  | "badge"
  | "placeholder"
  | "hint"
  | "required"
  | "value"
  | "min"
  | "max"
  | "step"
  | "suffix"
  | "style"
  | "href"
  | "effect"
  | "confirm"
  | "doneLabel"
  | "fields"
  | "actions"
  | "stats"
  | "trend"
  | "steps"
  | "preview"
  | "body"
  | "from"
  | "to"
  | "subject"
  | "tone"
  | "result"
  | "actionId"
  | "values"
  | "at"
  | "eyebrow"
  | "stepsLabel"
  | "footnote"
  | "status";
/** Untrusted JSON object from the AI — every known key is optional and unchecked. */
type Raw = Partial<Record<RawKey, unknown>>;
const isObj = (v: unknown): v is Raw => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, max: number): string | undefined => {
  if (typeof v === "number") v = String(v);
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  if (!s) return undefined;
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
};
const pick = <T extends string>(v: unknown, list: readonly T[], fallback: T): T =>
  typeof v === "string" && (list as readonly string[]).includes(v) ? (v as T) : fallback;
const maybe = <T extends string>(v: unknown, list: readonly T[]): T | undefined =>
  typeof v === "string" && (list as readonly string[]).includes(v) ? (v as T) : undefined;
const num = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;
const slug = (s: string, i: number) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || `item-${i}`;
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

const STATUS: readonly AvaCardStatus[] = ["open", "working", "done", "dismissed"];

function normalizeField(raw: unknown, i: number): AvaCardField | null {
  if (!isObj(raw)) return null;
  const label = str(raw.label, 60);
  if (!label) return null;
  let type = pick(raw.type, AVA_FIELD_TYPES, "text");
  const options = arr(raw.options)
    .map((o) => str(o, AVA_CARD_LIMITS.label))
    .filter((o): o is string => !!o)
    .slice(0, AVA_CARD_LIMITS.options);
  const choices = arr(raw.choices)
    .map((c, j): AvaCardChoice | null => {
      if (typeof c === "string") c = { label: c };
      if (!isObj(c)) return null;
      const l = str(c.label, AVA_CARD_LIMITS.label);
      if (!l) return null;
      return {
        id: str(c.id, 40) ?? slug(l, j),
        label: l,
        description: str(c.description, 90),
        icon: maybe(c.icon, AVA_CARD_ICONS),
        badge: str(c.badge, 20),
      };
    })
    .filter((c): c is AvaCardChoice => !!c)
    .slice(0, AVA_CARD_LIMITS.choices);
  // A choice field with nothing to choose from falls back to a text box.
  if ((type === "select" || type === "chips" || type === "multichips") && !options.length)
    type = "text";
  if (type === "tiles" && !choices.length) type = options.length ? "chips" : "text";
  const min = num(raw.min);
  const max = num(raw.max);
  return {
    id: str(raw.id, 40) ?? slug(label, i),
    label,
    type,
    options: options.length ? options : undefined,
    choices: choices.length ? choices : undefined,
    placeholder: str(raw.placeholder, 60),
    hint: str(raw.hint, 90),
    required: raw.required === true,
    value: str(raw.value, 400),
    min: type === "slider" ? (min ?? 0) : min,
    max: type === "slider" ? Math.max(max ?? 100, (min ?? 0) + 1) : max,
    step: num(raw.step),
    suffix: str(raw.suffix, 10),
  };
}

function normalizeAction(raw: unknown, i: number, hasFields: boolean): AvaCardAction | null {
  if (!isObj(raw)) return null;
  const label = str(raw.label, AVA_CARD_LIMITS.label);
  if (!label) return null;
  const style = pick(raw.style, AVA_ACTION_STYLES, i === 0 ? "primary" : "ghost");
  const href = str(raw.href, 300);
  const fallbackEffect: AvaActionEffect =
    style === "ghost" || style === "secondary" ? "dismiss" : hasFields ? "reply" : "run";
  let effect = pick(raw.effect, AVA_ACTION_EFFECTS, href ? "link" : fallbackEffect);
  // Only allow in-app paths and http(s) links.
  if (effect === "link" && (!href || !/^(\/(?!\/)|https?:\/\/)/i.test(href))) effect = "dismiss";
  return {
    id: str(raw.id, 40) ?? slug(label, i),
    label,
    style,
    effect,
    icon: maybe(raw.icon, AVA_CARD_ICONS),
    href: effect === "link" ? href : undefined,
    confirm: raw.confirm === true,
    doneLabel: str(raw.doneLabel, 60),
  };
}

/**
 * Turn whatever the AI sent into a safe, renderable card — or `null` if it has
 * no title. Unknown icons/tones/types fall back to defaults; long text is cut;
 * a card always ends up with at least one button.
 */
export function normalizeAvaCard(raw: unknown): AvaCard | null {
  if (!isObj(raw)) return null;
  const title = str(raw.title, AVA_CARD_LIMITS.title);
  if (!title) return null;

  const fields = arr(raw.fields)
    .map(normalizeField)
    .filter((f): f is AvaCardField => !!f)
    .slice(0, AVA_CARD_LIMITS.fields);
  // Unique field ids.
  const seen = new Set<string>();
  for (const f of fields) {
    let id = f.id;
    let n = 2;
    while (seen.has(id)) id = `${f.id}-${n++}`;
    f.id = id;
    seen.add(id);
  }

  let actions = arr(raw.actions)
    .map((a, i) => normalizeAction(a, i, fields.length > 0))
    .filter((a): a is AvaCardAction => !!a)
    .slice(0, AVA_CARD_LIMITS.actions);
  if (!actions.length) {
    actions = fields.length
      ? [
          { id: "send", label: "Send to Ava", style: "primary", effect: "reply" },
          { id: "skip", label: "Skip", style: "ghost", effect: "dismiss" },
        ]
      : [
          { id: "approve", label: "Approve", style: "primary", effect: "run" },
          { id: "decline", label: "Not now", style: "ghost", effect: "dismiss" },
        ];
  }

  const stats = arr(raw.stats)
    .map((s): AvaCardStat | null => {
      if (!isObj(s)) return null;
      const label = str(s.label, AVA_CARD_LIMITS.label);
      const value = str(s.value, 24);
      if (!label || !value) return null;
      return {
        label,
        value,
        trend: maybe(s.trend, ["up", "down"] as const),
        hint: str(s.hint, 40),
      };
    })
    .filter((s): s is AvaCardStat => !!s)
    .slice(0, AVA_CARD_LIMITS.stats);

  const steps = arr(raw.steps)
    .map((s) => str(s, 220))
    .filter((s): s is string => !!s)
    .slice(0, AVA_CARD_LIMITS.steps);

  let preview: AvaCardPreview | undefined;
  if (isObj(raw.preview)) {
    const body = str(raw.preview.body, 1200);
    if (body)
      preview = {
        body,
        label: str(raw.preview.label, AVA_CARD_LIMITS.label),
        from: str(raw.preview.from, 80),
        to: str(raw.preview.to, 80),
        subject: str(raw.preview.subject, 120),
      };
  }

  const tone = pick(
    raw.tone,
    AVA_CARD_TONES,
    actions.some((a) => a.style === "danger") ? "red" : "blue",
  );
  const result = isObj(raw.result)
    ? {
        actionId: str(raw.result.actionId, 40) ?? "",
        label: str(raw.result.label, 80) ?? "Done",
        values: isObj(raw.result.values)
          ? Object.fromEntries(
              Object.entries(raw.result.values as Record<string, unknown>)
                .map(([k, v]) => [k, str(v, 400)] as const)
                .filter((e): e is [string, string] => !!e[1]),
            )
          : undefined,
        at: str(raw.result.at, 20),
      }
    : undefined;

  return {
    tone,
    icon: pick(
      raw.icon,
      AVA_CARD_ICONS,
      fields.length ? "question" : tone === "red" ? "warning" : "sparkle",
    ),
    eyebrow: str(raw.eyebrow, AVA_CARD_LIMITS.eyebrow),
    title,
    description: str(raw.description, AVA_CARD_LIMITS.description),
    stats: stats.length ? stats : undefined,
    steps: steps.length ? steps : undefined,
    stepsLabel: str(raw.stepsLabel, AVA_CARD_LIMITS.label),
    preview,
    fields: fields.length ? fields : undefined,
    actions,
    footnote: str(raw.footnote, 120),
    status: pick(raw.status, STATUS, "open"),
    result,
  };
}

/** Starting values for a card's fields (pre-fills, toggles default to "No"). */
export function initialCardValues(card: AvaCard): Record<string, string> {
  const v: Record<string, string> = { ...(card.result?.values ?? {}) };
  for (const f of card.fields ?? []) {
    if (v[f.id] !== undefined) continue;
    if (f.value !== undefined) v[f.id] = f.value;
    else if (f.type === "toggle") v[f.id] = "No";
    else if (f.type === "slider") v[f.id] = String(f.min ?? 0);
  }
  return v;
}

/** Required fields still empty. */
export function missingCardFields(card: AvaCard, values: Record<string, string>): AvaCardField[] {
  return (card.fields ?? []).filter((f) => f.required && !values[f.id]?.trim());
}

/**
 * The card on a message. Older messages used `action` (approval) and
 * `request` (form); they are converted so everything renders the same way.
 */
export function cardOf(m: AssistantMessage): AvaCard | null {
  if (m.card) return normalizeAvaCard(m.card);
  if (m.action) {
    const a = m.action;
    const danger = a.tone === "danger";
    return normalizeAvaCard({
      tone: danger ? "red" : "blue",
      icon: danger ? "pause" : "sparkle",
      eyebrow: "Needs approval",
      title: a.title,
      stats: a.details?.map((d) => ({ label: d.label, value: d.value })),
      steps: a.steps,
      actions: [
        {
          id: "approve",
          label: a.approveLabel ?? "Approve",
          style: danger ? "danger" : "primary",
          effect: "run",
          confirm: danger,
        },
        { id: "decline", label: a.declineLabel ?? "Not now", style: "ghost", effect: "dismiss" },
      ],
      status: { pending: "open", running: "working", done: "done", declined: "dismissed" }[
        a.status
      ],
      result:
        a.status === "done"
          ? { actionId: "approve", label: "Done" }
          : a.status === "declined"
            ? { actionId: "decline", label: "Nothing was changed" }
            : undefined,
    });
  }
  if (m.request) {
    const r = m.request;
    return normalizeAvaCard({
      icon: "question",
      eyebrow: "Quick question",
      title: r.title,
      description: r.description,
      fields: r.fields,
      actions: [
        { id: "send", label: r.submitLabel ?? "Send to Ava", style: "primary", effect: "reply" },
        { id: "skip", label: "Skip", style: "ghost", effect: "dismiss" },
      ],
      status: r.status === "open" ? "open" : r.status === "submitted" ? "done" : "dismissed",
      result:
        r.status === "submitted"
          ? { actionId: "send", label: `${r.title} sent`, values: r.values }
          : undefined,
    });
  }
  return null;
}
