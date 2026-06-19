// Self-contained experiment module — Class 10 · Science · Acids, Bases and Salts
// Game: "Indicator Hunt" — Use ALL the NCERT Class 10 Chapter 2 indicators
// to identify two unknown solutions (Acidic, Basic).
//
// NCERT Class 10 indicators covered (Chapter 2 — Acids, Bases and Salts):
//   Natural:     Blue Litmus, Red Litmus, Turmeric, China Rose
//   Synthetic:   Phenolphthalein, Methyl Orange, Universal Indicator
//   Olfactory:   Onion, Vanilla, Clove Oil
//
// Each indicator is tagged with `category` so the player can render them
// in three labelled sections above the test tubes.
//
// This experiment uses `getReactionMulti` (the N-reagent reaction function)
// because it has more than 2 reagents.

import type { TestDef, ExperimentManifest, ReactionResult, ReactionVisual } from "@/lib/lab-types";

// ─── Indicator catalogue ─────────────────────────────────────────────────────
// Each indicator's reaction with Acidic / Basic solutions.
// `visual: "no-reaction"` means no visible colour change — the description
// still names what the student should observe.

type SolutionType = "Acidic Solution" | "Basic Solution";

interface IndicatorOutcome {
  color: string;
  visual: ReactionVisual;
  description: string;
}

const INDICATOR_OUTCOMES: Record<string, Record<SolutionType, IndicatorOutcome>> = {
  // ─── Natural Indicators ──────────────────────────────────────────────────
  "blue-litmus": {
    "Acidic Solution": {
      color: "rgba(239,68,68,0.75)",
      visual: "color-change",
      description: "Blue Litmus → Turns RED — acidic (natural indicator from lichens)",
    },
    "Basic Solution": {
      color: "rgba(59,130,246,0.55)",
      visual: "no-reaction",
      description: "Blue Litmus → Stays BLUE — basic",
    },
  },
  "red-litmus": {
    "Acidic Solution": {
      color: "rgba(239,68,68,0.55)",
      visual: "no-reaction",
      description: "Red Litmus → Stays RED — acidic",
    },
    "Basic Solution": {
      color: "rgba(59,130,246,0.75)",
      visual: "color-change",
      description: "Red Litmus → Turns BLUE — basic (natural indicator from lichens)",
    },
  },
  "turmeric": {
    "Acidic Solution": {
      color: "rgba(234,179,8,0.55)",
      visual: "no-reaction",
      description: "Turmeric → Stays YELLOW — acidic (natural indicator)",
    },
    "Basic Solution": {
      color: "rgba(127,29,29,0.85)",
      visual: "color-change",
      description: "Turmeric → Turns RED-BROWN — basic (natural indicator, haldi)",
    },
  },
  "china-rose": {
    "Acidic Solution": {
      color: "rgba(219,39,119,0.75)",
      visual: "color-change",
      description: "China Rose → Dark PINK/MAGENTA — acidic (natural indicator, gudhal)",
    },
    "Basic Solution": {
      color: "rgba(34,197,94,0.75)",
      visual: "color-change",
      description: "China Rose → GREEN — basic (natural indicator, gudhal)",
    },
  },

  // ─── Synthetic Indicators ────────────────────────────────────────────────
  "phenolphthalein": {
    "Acidic Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "Phenolphthalein → Stays COLORLESS — acidic medium",
    },
    "Basic Solution": {
      color: "rgba(236,72,153,0.85)",
      visual: "color-change",
      description: "Phenolphthalein → Turns bright PINK (magenta) — basic medium",
    },
  },
  "methyl-orange": {
    "Acidic Solution": {
      color: "rgba(239,68,68,0.75)",
      visual: "color-change",
      description: "Methyl Orange → Turns RED (pH < 3.1 — acidic)",
    },
    "Basic Solution": {
      color: "rgba(234,179,8,0.75)",
      visual: "color-change",
      description: "Methyl Orange → Turns YELLOW (pH > 4.4 — basic)",
    },
  },
  "universal-indicator": {
    "Acidic Solution": {
      color: "rgba(239,68,68,0.75)",
      visual: "color-change",
      description: "Universal Indicator → RED/ORANGE (pH ≈ 2 — strong acid)",
    },
    "Basic Solution": {
      color: "rgba(139,92,246,0.8)",
      visual: "color-change",
      description: "Universal Indicator → BLUE/VIOLET (pH ≈ 12 — strong base)",
    },
  },

  // ─── Olfactory Indicators (smell-based) ─────────────────────────────────
  "onion": {
    "Acidic Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "👃 Onion smell → REMAINS — acidic (olfactory indicator)",
    },
    "Basic Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "👃 Onion smell → DESTROYED — basic (olfactory indicator)",
    },
  },
  "vanilla": {
    "Acidic Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "👃 Vanilla smell → REMAINS — acidic (olfactory indicator)",
    },
    "Basic Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "👃 Vanilla smell → DESTROYED — basic (olfactory indicator)",
    },
  },
  "clove-oil": {
    "Acidic Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "👃 Clove oil smell → REMAINS — acidic (olfactory indicator, laung ka tel)",
    },
    "Basic Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "👃 Clove oil smell → DESTROYED — basic (olfactory indicator, laung ka tel)",
    },
  },
};

// ─── TestDef ─────────────────────────────────────────────────────────────────

export const indicatorHuntTest: TestDef = {
  id: "indicator-hunt",
  name: "Indicator Hunt",
  category: "Acids, Bases and Salts",
  emoji: "🌈",
  gradient: "from-rose-400 via-amber-400 to-violet-500",
  desc: "Use ALL the NCERT Class 10 indicators — Litmus, Turmeric, China Rose, Phenolphthalein, Methyl Orange, Universal Indicator, Onion, Vanilla & Clove Oil — to identify two mystery solutions (an Acid and a Base).",
  reagents: [
    // ─── Natural Indicators ────────────────────────────────────────────────
    {
      id: "blue-litmus",
      name: "Blue Litmus",
      shortName: "BL",
      accentColor: "#3b82f6",
      liquidColor: "rgba(59,130,246,0.35)",
      ringColor: "ring-blue-400",
      bgColor: "bg-blue-50",
      category: "natural",
    },
    {
      id: "red-litmus",
      name: "Red Litmus",
      shortName: "RL",
      accentColor: "#ef4444",
      liquidColor: "rgba(239,68,68,0.3)",
      ringColor: "ring-red-400",
      bgColor: "bg-red-50",
      category: "natural",
    },
    {
      id: "turmeric",
      name: "Turmeric (Haldi)",
      shortName: "Tm",
      accentColor: "#eab308",
      liquidColor: "rgba(234,179,8,0.4)",
      ringColor: "ring-yellow-400",
      bgColor: "bg-yellow-50",
      category: "natural",
    },
    {
      id: "china-rose",
      name: "China Rose (Gudhal)",
      shortName: "CR",
      accentColor: "#be185d",
      liquidColor: "rgba(190,24,93,0.25)",
      ringColor: "ring-fuchsia-400",
      bgColor: "bg-fuchsia-50",
      category: "natural",
    },
    // ─── Synthetic Indicators ──────────────────────────────────────────────
    {
      id: "phenolphthalein",
      name: "Phenolphthalein",
      shortName: "PhPh",
      accentColor: "#ec4899",
      liquidColor: "rgba(236,72,153,0.25)",
      ringColor: "ring-pink-400",
      bgColor: "bg-pink-50",
      category: "synthetic",
    },
    {
      id: "methyl-orange",
      name: "Methyl Orange",
      shortName: "MO",
      accentColor: "#f97316",
      liquidColor: "rgba(249,115,22,0.3)",
      ringColor: "ring-orange-400",
      bgColor: "bg-orange-50",
      category: "synthetic",
    },
    {
      id: "universal-indicator",
      name: "Universal Indicator",
      shortName: "UI",
      accentColor: "#10b981",
      liquidColor: "rgba(16,185,129,0.35)",
      ringColor: "ring-emerald-400",
      bgColor: "bg-emerald-50",
      category: "synthetic",
    },
    // ─── Olfactory Indicators (smell-based) ───────────────────────────────
    {
      id: "onion",
      name: "Onion",
      shortName: "On",
      accentColor: "#a16207",
      liquidColor: "rgba(161,98,7,0.2)",
      ringColor: "ring-amber-400",
      bgColor: "bg-amber-50",
      category: "olfactory",
    },
    {
      id: "vanilla",
      name: "Vanilla Extract",
      shortName: "Va",
      accentColor: "#92400e",
      liquidColor: "rgba(146,64,14,0.2)",
      ringColor: "ring-amber-700",
      bgColor: "bg-amber-100",
      category: "olfactory",
    },
    {
      id: "clove-oil",
      name: "Clove Oil (Laung)",
      shortName: "Cl",
      accentColor: "#7c2d12",
      liquidColor: "rgba(124,45,18,0.25)",
      ringColor: "ring-orange-900",
      bgColor: "bg-orange-100",
      category: "olfactory",
    },
  ],
  unknownTypes: ["Acidic Solution", "Basic Solution"],

  // Legacy 2-reagent signature is required by the type but never used at runtime
  // (the player checks for `getReactionMulti` first).
  getReaction: (type, r1Added, r2Added) => {
    const added: string[] = [];
    if (r1Added) added.push("blue-litmus");
    if (r2Added) added.push("red-litmus");
    return indicatorHuntTest.getReactionMulti!(type, added);
  },

  // N-reagent reaction function — actually used by the player.
  getReactionMulti: (unknownType: string, addedReagentIds: string[]): ReactionResult => {
    if (addedReagentIds.length === 0) {
      return {
        visual: "no-reaction",
        liquidColor: "transparent",
        description: "",
      };
    }

    // Use the LAST added indicator as the dominant visible signal.
    // (Earlier observations remain in the rolling observation log.)
    const lastId = addedReagentIds[addedReagentIds.length - 1];
    const outcome = INDICATOR_OUTCOMES[lastId]?.[unknownType as SolutionType];

    if (!outcome) {
      return {
        visual: "no-reaction",
        liquidColor: "transparent",
        description: "",
      };
    }

    return {
      visual: outcome.visual,
      liquidColor: outcome.color,
      description: outcome.description,
    };
  },

  introSteps: [
    {
      title: "Two Mystery Solutions",
      desc: "Tubes A and B contain an Acid (e.g. HCl) and a Base (e.g. NaOH) — in random order. Use indicators to find out which is which.",
    },
    {
      title: "10 NCERT Indicators — Three Types",
      desc: "Pick from 4 NATURAL indicators (Blue Litmus, Red Litmus, Turmeric, China Rose), 3 SYNTHETIC indicators (Phenolphthalein, Methyl Orange, Universal Indicator), and 3 OLFACTORY indicators (Onion, Vanilla, Clove Oil).",
    },
    {
      title: "Natural vs Synthetic vs Olfactory",
      desc: "Litmus, Turmeric & China Rose are natural (from living things). Phenolphthalein, Methyl Orange & Universal Indicator are synthetic (lab-made dyes). Onion, Vanilla & Clove Oil are olfactory — they reveal the base by losing their characteristic smell.",
    },
    {
      title: "Cross-Check, Then Identify",
      desc: "Each indicator gives one clue. Add 2-3 indicators to each tube to be sure, then assign Acidic / Basic to each sample.",
    },
  ],
  reactionKey: [
    {
      type: "Acidic Solution (e.g. HCl)",
      results: [
        "Universal Indicator → Red/Orange (pH ≈ 2)",
        "Phenolphthalein → Colorless",
        "Methyl Orange → Red",
        "Blue Litmus → Turns Red  (Red Litmus stays Red)",
        "Turmeric → Stays Yellow",
        "China Rose → Dark Pink/Magenta",
        "Onion, Vanilla & Clove Oil → Smell REMAINS",
      ],
      color: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      type: "Basic Solution (e.g. NaOH)",
      results: [
        "Universal Indicator → Blue/Violet (pH ≈ 12)",
        "Phenolphthalein → Bright Pink",
        "Methyl Orange → Yellow",
        "Blue Litmus → Stays Blue  (Red Litmus → Turns Blue)",
        "Turmeric → Turns Red-Brown",
        "China Rose → Green",
        "Onion, Vanilla & Clove Oil → Smell DESTROYED",
      ],
      color: "bg-violet-50",
      textColor: "text-violet-700",
    },
  ],
  recap: [
    "Natural indicators come from living things — Litmus (from lichens), Turmeric (root), China Rose (flower petals). Synthetic indicators like Phenolphthalein, Methyl Orange and Universal Indicator are made in labs.",
    "Universal Indicator is a mixture of many dyes — its colour spans the entire pH scale from red (pH 1, strong acid) through green (pH 7, neutral) to violet (pH 14, strong base).",
    "Phenolphthalein is the cleanest base-only test: pink in basic (pH > 8.2) and colorless in acid/neutral. Methyl Orange distinguishes acid (red) from base (yellow) sharply.",
    "Litmus comes in two colours: Blue Litmus turns Red in acid; Red Litmus turns Blue in base. Use both to confirm which side of neutral you're on.",
    "Olfactory indicators (Onion, Vanilla, Clove Oil) work by smell — basic solutions destroy their characteristic smell while acidic solutions preserve it. Useful when colour indicators are unavailable or for visually-impaired students.",
    "A single indicator is rarely enough — combine 2-3 from different types (one colour-change + one olfactory, for example) to confidently tell the acid from the base.",
  ],
};

export const manifest: ExperimentManifest = {
  id: "indicator-hunt",
  title: "Indicator Hunt",
  emoji: "🌈",
  blurb:
    "Hunt down the Acid & Base among 2 mystery solutions using ALL 10 NCERT Class 10 indicators — Litmus, Turmeric, China Rose, PhPh, MO, UI, Onion, Vanilla & Clove Oil.",
  gradient: "from-rose-400 via-amber-400 to-violet-500",
  durationMin: 10,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, test: indicatorHuntTest };
export default module;
