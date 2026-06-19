// Self-contained experiment module — Class 10 · Science · Acids, Bases and Salts
// Game: "Indicator Hunt" — Use Universal Indicator + Phenolphthalein to identify
// three unknown solutions (Acidic, Basic, Neutral).

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const indicatorHuntTest: TestDef = {
  id: "indicator-hunt",
  name: "Indicator Hunt",
  category: "Acids, Bases and Salts",
  emoji: "🌈",
  gradient: "from-rose-400 via-amber-400 to-violet-500",
  desc: "Use Universal Indicator and Phenolphthalein to identify three unknown solutions as Acidic, Basic, or Neutral.",
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
  ],
  unknownTypes: ["Acidic Solution", "Basic Solution", "Neutral Solution"],
  getReaction(type, r1Added, r2Added) {
    // r1 = Universal Indicator, r2 = Phenolphthalein
    const hasUI = r1Added;
    const hasPh = r2Added;

    if (!hasUI && !hasPh) {
      return {
        visual: "no-reaction",
        liquidColor: "transparent",
        description: "",
      };
    }

    // Color table for Universal Indicator (single reagent)
    // Acidic (pH 1-3) → Red/Orange, Neutral (pH 7) → Green, Basic (pH 11-14) → Blue/Purple
    const uiColorFor = (t: string) => {
      if (t === "Acidic Solution") return "rgba(239,68,68,0.7)"; // red
      if (t === "Basic Solution") return "rgba(139,92,246,0.7)"; // violet
      return "rgba(34,197,94,0.7)"; // green
    };

    const uiNameFor = (t: string) => {
      if (t === "Acidic Solution") return "Red/Orange — strong acid (pH ≈ 2)";
      if (t === "Basic Solution") return "Blue/Violet — strong base (pH ≈ 12)";
      return "Green — neutral (pH ≈ 7)";
    };

    // Phenolphthalein alone: pink in basic, colorless in acid / neutral
    const phColorFor = (t: string) => {
      if (t === "Basic Solution") return "rgba(236,72,153,0.85)"; // bright pink
      return "rgba(255,255,255,0.15)"; // colorless
    };

    const phNameFor = (t: string) => {
      if (t === "Basic Solution") return "Bright pink (magenta) — basic medium";
      if (t === "Acidic Solution") return "Stays colorless — acidic medium";
      return "Stays colorless — neutral medium";
    };

    // Both indicators added — UI dominates the visible hue (Ph makes basic a deeper pink-violet)
    if (hasUI && hasPh) {
      if (type === "Acidic Solution") {
        return {
          visual: "color-change",
          liquidColor: "rgba(239,68,68,0.7)",
          description:
            "Universal Indicator turns Red/Orange (pH ≈ 2 — strong acid). Phenolphthalein stays colorless in acid.",
        };
      }
      if (type === "Basic Solution") {
        return {
          visual: "color-change",
          liquidColor: "rgba(168,85,247,0.85)",
          description:
            "Universal Indicator turns Violet (pH ≈ 12 — strong base) AND Phenolphthalein turns bright pink — basic medium confirmed.",
        };
      }
      // Neutral
      return {
        visual: "color-change",
        liquidColor: "rgba(34,197,94,0.7)",
        description:
          "Universal Indicator turns Green (pH ≈ 7 — neutral). Phenolphthalein stays colorless in neutral medium.",
      };
    }

    // Only Universal Indicator added
    if (hasUI) {
      return {
        visual: "color-change",
        liquidColor: uiColorFor(type),
        description: `Universal Indicator: ${uiNameFor(type)}.`,
      };
    }

    // Only Phenolphthalein added
    return {
      visual: type === "Basic Solution" ? "color-change" : "no-reaction",
      liquidColor: phColorFor(type),
      description: `Phenolphthalein: ${phNameFor(type)}.`,
    };
  },
  introSteps: [
    {
      title: "Three Mystery Solutions",
      desc: "Tubes A, B, C contain an Acid, a Base, and pure Water (neutral) — in random order.",
    },
    {
      title: "Add Universal Indicator (UI)",
      desc: "UI shows a full pH map: Red/Orange = acid, Green = neutral, Blue/Violet = base.",
    },
    {
      title: "Add Phenolphthalein (PhPh)",
      desc: "PhPh turns pink only in basic medium. It stays colorless in acids and neutral water.",
    },
    {
      title: "Identify Each Sample",
      desc: "Combine both colour clues to label each tube — Acidic, Basic, or Neutral.",
    },
  ],
  reactionKey: [
    {
      type: "Acidic Solution",
      results: [
        "+ Universal Indicator → Red/Orange (pH ≈ 2)",
        "+ Phenolphthalein → Stays colorless",
      ],
      color: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      type: "Neutral Solution",
      results: [
        "+ Universal Indicator → Green (pH ≈ 7)",
        "+ Phenolphthalein → Stays colorless",
      ],
      color: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      type: "Basic Solution",
      results: [
        "+ Universal Indicator → Blue/Violet (pH ≈ 12)",
        "+ Phenolphthalein → Turns bright pink",
      ],
      color: "bg-violet-50",
      textColor: "text-violet-700",
    },
  ],
  recap: [
    "Universal Indicator is a mixture of many dyes — its colour spans the entire pH scale from red (strong acid) through green (neutral) to violet (strong base).",
    "Phenolphthalein is a single-dye indicator that is pink in basic solutions (pH > 8.2) and colorless in acidic and neutral solutions.",
    "Pure water is neutral (pH = 7) — UI turns green and PhPh stays colorless, which is the key clue that distinguishes neutral from acidic.",
    "Real Class 10 lab: also try Litmus (Blue→Red in acid, Red→Blue in base) and Methyl Orange (Red in acid, Yellow in base) for more confirmation.",
  ],
};

export const manifest: ExperimentManifest = {
  id: "indicator-hunt",
  title: "Indicator Hunt",
  emoji: "🌈",
  blurb:
    "Use Universal Indicator + Phenolphthalein to hunt down Acid, Base & Neutral among 3 mystery solutions.",
  gradient: "from-rose-400 via-amber-400 to-violet-500",
  durationMin: 6,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, test: indicatorHuntTest };
export default module;
