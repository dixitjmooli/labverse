// Self-contained experiment module — Class 10 · Science · Acids, Bases and Salts
// Game: "Indicator Hunt" — Use ALL the indicators from NCERT Class 10 Chapter 2
// to identify three unknown solutions (Acidic, Basic, Neutral).
//
// NCERT Class 10 indicators covered (Chapter 2 — Acids, Bases and Salts):
//   Natural:     Blue Litmus, Red Litmus, Turmeric, China Rose
//   Synthetic:   Phenolphthalein, Methyl Orange
//   Mixture:     Universal Indicator
//   Olfactory:   Onion, Vanilla extract
//
// This experiment uses `getReactionMulti` (the N-reagent reaction function)
// because it has more than 2 reagents.

import type { TestDef, ExperimentManifest, ReactionResult, ReactionVisual } from "@/lib/lab-types";

// ─── Indicator catalogue ─────────────────────────────────────────────────────
// Each indicator's reaction with Acidic / Neutral / Basic solutions.
// `visual: "no-reaction"` means no visible colour change — the description
// still names what the student should observe.

type SolutionType = "Acidic Solution" | "Neutral Solution" | "Basic Solution";

interface IndicatorOutcome {
  color: string;
  visual: ReactionVisual;
  description: string;
}

const INDICATOR_OUTCOMES: Record<string, Record<SolutionType, IndicatorOutcome>> = {
  "universal-indicator": {
    "Acidic Solution": {
      color: "rgba(239,68,68,0.75)",
      visual: "color-change",
      description: "Universal Indicator → Red/Orange (pH ≈ 2 — strong acid)",
    },
    "Neutral Solution": {
      color: "rgba(34,197,94,0.75)",
      visual: "color-change",
      description: "Universal Indicator → Green (pH ≈ 7 — neutral)",
    },
    "Basic Solution": {
      color: "rgba(139,92,246,0.8)",
      visual: "color-change",
      description: "Universal Indicator → Blue/Violet (pH ≈ 12 — strong base)",
    },
  },
  "phenolphthalein": {
    "Acidic Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "Phenolphthalein → Stays colorless — acidic medium",
    },
    "Neutral Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "Phenolphthalein → Stays colorless — neutral medium",
    },
    "Basic Solution": {
      color: "rgba(236,72,153,0.85)",
      visual: "color-change",
      description: "Phenolphthalein → Turns bright pink (magenta) — basic medium",
    },
  },
  "methyl-orange": {
    "Acidic Solution": {
      color: "rgba(239,68,68,0.75)",
      visual: "color-change",
      description: "Methyl Orange → Turns Red (pH < 3.1 — acidic)",
    },
    "Neutral Solution": {
      color: "rgba(249,115,22,0.7)",
      visual: "color-change",
      description: "Methyl Orange → Turns Orange (pH ≈ 3.1–4.4 — near neutral)",
    },
    "Basic Solution": {
      color: "rgba(234,179,8,0.75)",
      visual: "color-change",
      description: "Methyl Orange → Turns Yellow (pH > 4.4 — basic)",
    },
  },
  "blue-litmus": {
    "Acidic Solution": {
      color: "rgba(239,68,68,0.75)",
      visual: "color-change",
      description: "Blue Litmus → Turns Red — acidic",
    },
    "Neutral Solution": {
      color: "rgba(59,130,246,0.55)",
      visual: "no-reaction",
      description: "Blue Litmus → Stays Blue — neutral",
    },
    "Basic Solution": {
      color: "rgba(59,130,246,0.55)",
      visual: "no-reaction",
      description: "Blue Litmus → Stays Blue — basic",
    },
  },
  "red-litmus": {
    "Acidic Solution": {
      color: "rgba(239,68,68,0.55)",
      visual: "no-reaction",
      description: "Red Litmus → Stays Red — acidic",
    },
    "Neutral Solution": {
      color: "rgba(239,68,68,0.55)",
      visual: "no-reaction",
      description: "Red Litmus → Stays Red — neutral",
    },
    "Basic Solution": {
      color: "rgba(59,130,246,0.75)",
      visual: "color-change",
      description: "Red Litmus → Turns Blue — basic",
    },
  },
  "turmeric": {
    "Acidic Solution": {
      color: "rgba(234,179,8,0.55)",
      visual: "no-reaction",
      description: "Turmeric → Stays Yellow — acidic",
    },
    "Neutral Solution": {
      color: "rgba(234,179,8,0.55)",
      visual: "no-reaction",
      description: "Turmeric → Stays Yellow — neutral",
    },
    "Basic Solution": {
      color: "rgba(127,29,29,0.85)",
      visual: "color-change",
      description: "Turmeric → Turns Red-Brown — basic (natural indicator)",
    },
  },
  "china-rose": {
    "Acidic Solution": {
      color: "rgba(219,39,119,0.75)",
      visual: "color-change",
      description: "China Rose → Dark Pink/Magenta — acidic",
    },
    "Neutral Solution": {
      color: "rgba(244,114,182,0.5)",
      visual: "color-change",
      description: "China Rose → Light Pink — neutral",
    },
    "Basic Solution": {
      color: "rgba(34,197,94,0.75)",
      visual: "color-change",
      description: "China Rose → Green — basic (natural indicator)",
    },
  },
  "onion": {
    "Acidic Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "Onion smell → REMAINS — acidic (olfactory indicator)",
    },
    "Neutral Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "Onion smell → REMAINS — neutral (olfactory indicator)",
    },
    "Basic Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "Onion smell → DESTROYED — basic (olfactory indicator)",
    },
  },
  "vanilla": {
    "Acidic Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "Vanilla smell → REMAINS — acidic (olfactory indicator)",
    },
    "Neutral Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "Vanilla smell → REMAINS — neutral (olfactory indicator)",
    },
    "Basic Solution": {
      color: "rgba(255,255,255,0.18)",
      visual: "no-reaction",
      description: "Vanilla smell → DESTROYED — basic (olfactory indicator)",
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
  desc: "Use ALL the NCERT Class 10 indicators — Litmus, Turmeric, China Rose, Phenolphthalein, Methyl Orange, Universal Indicator, Onion & Vanilla — to identify three mystery solutions.",
  reagents: [
    {
      id: "universal-indicator",
      name: "Universal Indicator",
      shortName: "UI",
      accentColor: "#10b981",
      liquidColor: "rgba(16,185,129,0.35)",
      ringColor: "ring-emerald-400",
      bgColor: "bg-emerald-50",
    },
    {
      id: "phenolphthalein",
      name: "Phenolphthalein",
      shortName: "PhPh",
      accentColor: "#ec4899",
      liquidColor: "rgba(236,72,153,0.25)",
      ringColor: "ring-pink-400",
      bgColor: "bg-pink-50",
    },
    {
      id: "methyl-orange",
      name: "Methyl Orange",
      shortName: "MO",
      accentColor: "#f97316",
      liquidColor: "rgba(249,115,22,0.3)",
      ringColor: "ring-orange-400",
      bgColor: "bg-orange-50",
    },
    {
      id: "blue-litmus",
      name: "Blue Litmus",
      shortName: "BL",
      accentColor: "#3b82f6",
      liquidColor: "rgba(59,130,246,0.35)",
      ringColor: "ring-blue-400",
      bgColor: "bg-blue-50",
    },
    {
      id: "red-litmus",
      name: "Red Litmus",
      shortName: "RL",
      accentColor: "#ef4444",
      liquidColor: "rgba(239,68,68,0.3)",
      ringColor: "ring-red-400",
      bgColor: "bg-red-50",
    },
    {
      id: "turmeric",
      name: "Turmeric (Haldi)",
      shortName: "Tm",
      accentColor: "#eab308",
      liquidColor: "rgba(234,179,8,0.4)",
      ringColor: "ring-yellow-400",
      bgColor: "bg-yellow-50",
    },
    {
      id: "china-rose",
      name: "China Rose (Gudhal)",
      shortName: "CR",
      accentColor: "#be185d",
      liquidColor: "rgba(190,24,93,0.25)",
      ringColor: "ring-fuchsia-400",
      bgColor: "bg-fuchsia-50",
    },
    {
      id: "onion",
      name: "Onion (Olfactory)",
      shortName: "On",
      accentColor: "#a16207",
      liquidColor: "rgba(161,98,7,0.2)",
      ringColor: "ring-amber-400",
      bgColor: "bg-amber-50",
    },
    {
      id: "vanilla",
      name: "Vanilla Extract",
      shortName: "Va",
      accentColor: "#92400e",
      liquidColor: "rgba(146,64,14,0.2)",
      ringColor: "ring-amber-700",
      bgColor: "bg-amber-100",
    },
  ],
  unknownTypes: ["Acidic Solution", "Basic Solution", "Neutral Solution"],

  // Legacy 2-reagent signature is required by the type but never used at runtime
  // (the player checks for `getReactionMulti` first).
  getReaction: (type, r1Added, r2Added) => {
    const added: string[] = [];
    if (r1Added) added.push("universal-indicator");
    if (r2Added) added.push("phenolphthalein");
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
      title: "Three Mystery Solutions",
      desc: "Tubes A, B, C contain an Acid (e.g. HCl), a Base (e.g. NaOH), and pure Water (neutral) — in random order.",
    },
    {
      title: "9 NCERT Indicators at Your Disposal",
      desc: "Pick from Universal Indicator, Phenolphthalein, Methyl Orange, Blue/Red Litmus, Turmeric, China Rose, Onion, and Vanilla — everything covered in NCERT Chapter 2.",
    },
    {
      title: "Natural vs Synthetic vs Olfactory",
      desc: "Litmus, Turmeric & China Rose are natural. Phenolphthalein & Methyl Orange are synthetic. Universal Indicator is a mixture of many dyes. Onion & Vanilla are olfactory — they reveal the base by losing their smell.",
    },
    {
      title: "Cross-Check, Then Identify",
      desc: "Each indicator gives one clue. Combine 2-3 clues per tube to be sure, then assign Acidic / Basic / Neutral to each sample.",
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
        "Onion & Vanilla → Smell REMAINS",
      ],
      color: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      type: "Neutral Solution (e.g. pure Water)",
      results: [
        "Universal Indicator → Green (pH ≈ 7)",
        "Phenolphthalein → Colorless",
        "Methyl Orange → Orange",
        "Blue Litmus → Stays Blue  (Red Litmus stays Red)",
        "Turmeric → Stays Yellow",
        "China Rose → Light Pink",
        "Onion & Vanilla → Smell REMAINS",
      ],
      color: "bg-emerald-50",
      textColor: "text-emerald-700",
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
        "Onion & Vanilla → Smell DESTROYED",
      ],
      color: "bg-violet-50",
      textColor: "text-violet-700",
    },
  ],
  recap: [
    "Natural indicators come from living things — Litmus (from lichens), Turmeric (root), China Rose (flower petals). Synthetic indicators like Phenolphthalein and Methyl Orange are made in labs.",
    "Universal Indicator is a mixture of many dyes — its colour spans the entire pH scale from red (pH 1, strong acid) through green (pH 7, neutral) to violet (pH 14, strong base).",
    "Phenolphthalein is the cleanest base-only test: pink in basic (pH > 8.2) and colorless in acid/neutral. Methyl Orange distinguishes acid (red) from base (yellow) sharply.",
    "Litmus comes in two colours: Blue Litmus turns Red in acid; Red Litmus turns Blue in base. Use both to confirm which side of neutral you're on.",
    "Olfactory indicators (Onion, Vanilla, Clove oil) work by smell — basic solutions destroy their characteristic smell while acidic and neutral solutions preserve it. Useful when colour indicators are unavailable.",
    "Pure water is neutral (pH = 7) — Universal Indicator turns Green and Phenolphthalein stays colorless. This combination uniquely distinguishes neutral from acidic, because both turn colorless with PhPh.",
  ],
};

export const manifest: ExperimentManifest = {
  id: "indicator-hunt",
  title: "Indicator Hunt",
  emoji: "🌈",
  blurb:
    "Hunt down Acid, Base & Neutral among 3 mystery solutions using ALL 9 NCERT Class 10 indicators — Litmus, Turmeric, China Rose, PhPh, MO, UI, Onion & Vanilla.",
  gradient: "from-rose-400 via-amber-400 to-violet-500",
  durationMin: 10,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, test: indicatorHuntTest };
export default module;
