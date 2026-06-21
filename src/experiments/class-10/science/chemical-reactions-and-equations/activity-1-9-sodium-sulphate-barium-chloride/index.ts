// NCERT Class 10 · Science · Chapter 1 · Activity 1.9
// Sodium Sulphate + Barium Chloride — Double Displacement reaction.
//
// Equation: Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl
// Observation: heavy WHITE precipitate of barium sulphate (BaSO₄) forms immediately.

import type { TestDef, ExperimentManifest, ReactionResult } from "@/lib/lab-types";

const ACTIVITY_TYPE = "Double Displacement";

const INITIAL: ReactionResult = {
  visual: "no-reaction",
  liquidColor: "rgba(219,234,254,0.45)", // clear Na₂SO₄ solution
  description:
    "Apparatus: SODIUM SULPHATE solution (Na₂SO₄ — CLEAR) in a test tube. Add the right reagent to start the reaction.",
};

const RESULT: ReactionResult = {
  visual: "precipitate",
  precipitateColor: "#f8fafc", // heavy white BaSO₄ precipitate
  liquidColor: "rgba(219,234,254,0.25)",
  description:
    "⚪ A heavy WHITE precipitate of BARIUM SULPHATE (BaSO₄) forms IMMEDIATELY. The mixture turns cloudy white. Balanced equation: Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl. The Ba²⁺ and Na⁺ ions exchange partners — a double displacement reaction.",
};

const NO_REACTION: ReactionResult = {
  visual: "no-reaction",
  liquidColor: "rgba(219,234,254,0.45)",
  description:
    "Nothing happens. The clear solution stays clear. What reagent should you add to sodium sulphate to get a white precipitate?",
};

export const sodiumSulphateBariumChlorideTest: TestDef = {
  id: "activity-1-9-sodium-sulphate-barium-chloride",
  name: "Activity 1.9 — Na₂SO₄ + BaCl₂",
  category: "Chemical Reactions and Equations",
  emoji: "⚪",
  gradient: "from-slate-300 to-blue-400",
  desc: "NCERT Activity 1.9: Mix sodium sulphate solution and barium chloride solution. Observe the formation of a heavy white precipitate of barium sulphate (BaSO₄). Double displacement reaction.",
  reagents: [
    { id: "bacl2",       name: "BaCl₂ solution", shortName: "BaCl₂", accentColor: "#0284c7", liquidColor: "rgba(2,132,199,0.30)", ringColor: "ring-sky-500",     bgColor: "bg-sky-50" },
    { id: "heat",        name: "Heat",           shortName: "🔥",     accentColor: "#dc2626", liquidColor: "rgba(239,68,68,0.35)", ringColor: "ring-red-500",     bgColor: "bg-red-50" },
    { id: "electricity", name: "Electricity",    shortName: "⚡",     accentColor: "#facc15", liquidColor: "rgba(250,204,21,0.35)",ringColor: "ring-yellow-400",  bgColor: "bg-yellow-50" },
    { id: "sunlight",    name: "Sunlight",       shortName: "☀️",     accentColor: "#f59e0b", liquidColor: "rgba(251,191,36,0.35)",ringColor: "ring-amber-400",   bgColor: "bg-amber-50" },
  ],
  unknownTypes: [ACTIVITY_TYPE],
  identifyOptions: ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"],
  getReaction: (_t, _r1, _r2) => NO_REACTION,
  getReactionMulti: (_type, added) => {
    if (added.length === 0) return INITIAL;
    return added.includes("bacl2") ? RESULT : NO_REACTION;
  },
  introSteps: [
    { title: "Activity 1.9 Setup", desc: "Take about 3 mL of SODIUM SULPHATE solution (Na₂SO₄) in a test tube. The solution is clear and colourless." },
    { title: "Add the Second Solution", desc: "Which reagent should you add? The activity calls for BARIUM CHLORIDE (BaCl₂) solution." },
    { title: "Observe the Precipitate", desc: "Watch for an IMMEDIATE formation of a heavy WHITE precipitate (barium sulphate, BaSO₄). No heat or light needed — just mixing." },
    { title: "Identify the Type", desc: "Both reactants are ionic salts. They exchange ions (Ba²⁺ swaps partners with Na⁺). What type of reaction is this?" },
  ],
  reactionKey: [
    {
      type: "Double Displacement Reaction",
      results: [
        "Pattern: AB + CD → AD + CB (two compounds exchange ions)",
        "Driven by formation of a precipitate, gas, or water",
        "Examples: Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl,  Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃",
      ],
      color: "bg-sky-50",
      textColor: "text-sky-700",
    },
  ],
  recap: [
    "When sodium sulphate (Na₂SO₄) and barium chloride (BaCl₂) solutions are mixed, the Ba²⁺ and SO₄²⁻ ions combine to form barium sulphate (BaSO₄), which is INSOLUBLE in water. The insoluble BaSO₄ comes out of solution as a heavy white precipitate.",
    "Meanwhile, the Na⁺ and Cl⁻ ions remain in solution as sodium chloride (NaCl) — common salt, which is soluble. Both reactants exchange ions — the defining feature of a double displacement reaction.",
    "Barium sulphate is one of the most insoluble salts in water (Ksp ≈ 1.1 × 10⁻¹⁰). That is why even a trace of sulphate ion in solution can be detected by adding BaCl₂ — a white precipitate confirms the presence of SO₄²⁻.",
    "In medicine, BaSO₄ is used in 'barium meal' X-ray imaging of the digestive tract. Because BaSO₄ is insoluble, it is not absorbed by the body — it simply coats the lining of the stomach/intestines, making them visible on X-rays. (Soluble barium salts are highly toxic, so insolubility is what makes this safe.)",
    "Both Activity 1.8 (Pb(NO₃)₂ + KI) and Activity 1.9 (Na₂SO₄ + BaCl₂) are double displacement reactions driven by precipitate formation. The other two drivers — gas evolution and water formation — also occur, e.g., Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑ (gas) and NaOH + HCl → NaCl + H₂O (water).",
  ],
};

export const manifest: ExperimentManifest = {
  id: "activity-1-9-sodium-sulphate-barium-chloride",
  title: "Activity 1.9 — Na₂SO₄ + BaCl₂",
  emoji: "⚪",
  blurb: "NCERT Activity 1.9: Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl. Heavy white precipitate of barium sulphate forms instantly. Double displacement reaction.",
  gradient: "from-slate-300 to-blue-400",
  durationMin: 5,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, test: sodiumSulphateBariumChlorideTest };
export default module;
