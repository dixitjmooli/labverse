// NCERT Class 10 · Science · Chapter 1 · Activity 1.8
// Lead Nitrate + Potassium Iodide — Double Displacement reaction.
//
// Equation: Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃
// Observation: bright YELLOW precipitate of lead iodide (PbI₂) forms immediately.

import type { TestDef, ExperimentManifest, ReactionResult } from "@/lib/lab-types";

const ACTIVITY_TYPE = "Double Displacement";

const INITIAL: ReactionResult = {
  visual: "no-reaction",
  liquidColor: "rgba(219,234,254,0.45)", // clear Pb(NO₃)₂ solution
  description:
    "Apparatus: LEAD NITRATE solution [Pb(NO₃)₂ — CLEAR] in a test tube. Add the right reagent to start the reaction.",
};

const RESULT: ReactionResult = {
  visual: "precipitate",
  precipitateColor: "#facc15", // bright yellow PbI₂ precipitate
  liquidColor: "rgba(219,234,254,0.25)",
  description:
    "🟡 A bright YELLOW precipitate of LEAD IODIDE (PbI₂) forms IMMEDIATELY when KI is added. The mixture becomes cloudy yellow. Balanced equation: Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃. The Pb²⁺ and K⁺ ions exchange partners — a double displacement reaction.",
};

const NO_REACTION: ReactionResult = {
  visual: "no-reaction",
  liquidColor: "rgba(219,234,254,0.45)",
  description:
    "Nothing happens. The clear solution stays clear. What reagent should you add to lead nitrate to get a yellow precipitate?",
};

export const leadNitratePotassiumIodideTest: TestDef = {
  id: "activity-1-8-lead-nitrate-potassium-iodide",
  name: "Activity 1.8 — Pb(NO₃)₂ + KI",
  category: "Chemical Reactions and Equations",
  emoji: "🟡",
  gradient: "from-yellow-300 to-amber-500",
  desc: "NCERT Activity 1.8: Mix lead nitrate solution and potassium iodide solution. Observe the formation of a bright yellow precipitate of lead iodide (PbI₂). Double displacement reaction.",
  reagents: [
    { id: "ki",          name: "KI solution",   shortName: "KI",  accentColor: "#7c3aed", liquidColor: "rgba(124,58,237,0.25)", ringColor: "ring-violet-500",  bgColor: "bg-violet-50" },
    { id: "heat",        name: "Heat",          shortName: "🔥",  accentColor: "#dc2626", liquidColor: "rgba(239,68,68,0.35)",  ringColor: "ring-red-500",     bgColor: "bg-red-50" },
    { id: "electricity", name: "Electricity",   shortName: "⚡",  accentColor: "#facc15", liquidColor: "rgba(250,204,21,0.35)", ringColor: "ring-yellow-400",  bgColor: "bg-yellow-50" },
    { id: "sunlight",    name: "Sunlight",      shortName: "☀️",  accentColor: "#f59e0b", liquidColor: "rgba(251,191,36,0.35)", ringColor: "ring-amber-400",   bgColor: "bg-amber-50" },
  ],
  unknownTypes: [ACTIVITY_TYPE],
  identifyOptions: ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"],
  getReaction: (_t, _r1, _r2) => NO_REACTION,
  getReactionMulti: (_type, added) => {
    if (added.length === 0) return INITIAL;
    return added.includes("ki") ? RESULT : NO_REACTION;
  },
  introSteps: [
    { title: "Activity 1.8 Setup", desc: "Take about 3 mL of LEAD NITRATE solution [Pb(NO₃)₂] in a test tube. The solution is clear and colourless." },
    { title: "Add the Second Solution", desc: "Which reagent should you add? The activity calls for POTASSIUM IODIDE (KI) solution." },
    { title: "Observe the Precipitate", desc: "Watch for an IMMEDIATE formation of a bright YELLOW precipitate (lead iodide, PbI₂). No heat, no light needed — just mixing." },
    { title: "Identify the Type", desc: "Both reactants are ionic salts. They exchange ions (Pb²⁺ swaps partners with K⁺). What type of reaction is this?" },
  ],
  reactionKey: [
    {
      type: "Double Displacement Reaction",
      results: [
        "Pattern: AB + CD → AD + CB (two compounds exchange ions)",
        "Driven by formation of a precipitate, gas, or water",
        "Examples: Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃,  Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl",
      ],
      color: "bg-sky-50",
      textColor: "text-sky-700",
    },
  ],
  recap: [
    "When lead nitrate [Pb(NO₃)₂] and potassium iodide (KI) solutions are mixed, the Pb²⁺ and I⁻ ions combine to form lead iodide (PbI₂), which is INSOLUBLE in water. The insoluble PbI₂ comes out of solution as a bright yellow precipitate.",
    "Meanwhile, the K⁺ and NO₃⁻ ions remain in solution as potassium nitrate (KNO₃), which is soluble. Both salts exchange ions — that is the defining feature of a double displacement reaction.",
    "The 'Golden Rain' demonstration uses this same reaction: PbI₂ is dissolved in hot water (it is more soluble hot) and then allowed to cool slowly. As it cools, glittering golden crystals of PbI₂ recrystallise — looking like falling golden rain.",
    "Lead iodide is one of the few bright YELLOW precipitates in inorganic chemistry. This makes the Pb²⁺ + I⁻ test a confirmatory test for both ions: yellow precipitate = both lead and iodide are present.",
    "A double displacement reaction is driven forward by any of three things: (1) formation of a precipitate (insoluble solid), (2) evolution of a gas, or (3) formation of a molecular compound like water. If none of these happens, no reaction occurs.",
  ],
};

export const manifest: ExperimentManifest = {
  id: "activity-1-8-lead-nitrate-potassium-iodide",
  title: "Activity 1.8 — Pb(NO₃)₂ + KI",
  emoji: "🟡",
  blurb: "NCERT Activity 1.8: Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃. Bright yellow precipitate of lead iodide forms instantly. Double displacement reaction.",
  gradient: "from-yellow-300 to-amber-500",
  durationMin: 5,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, test: leadNitratePotassiumIodideTest };
export default module;
