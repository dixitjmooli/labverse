// NCERT Class 10 · Science · Chapter 1 · Activity 1.2
// Zinc granules + dilute hydrochloric acid — Displacement reaction.
//
// Equation: Zn + 2HCl → ZnCl₂ + H₂↑
// Observation: vigorous bubbles of H₂ gas, tube feels warm (exothermic),
//              H₂ gas gives a 'pop' sound with a burning matchstick.

import type { TestDef, ExperimentManifest, ReactionResult } from "@/lib/lab-types";

const ACTIVITY_TYPE = "Displacement";

const INITIAL: ReactionResult = {
  visual: "precipitate",
  precipitateColor: "#cbd5e1", // silver Zn granules at bottom
  liquidColor: "transparent",
  description:
    "Apparatus: A few ZINC GRANULES (silver-grey metal) at the bottom of a test tube. Add the right reagent to start the reaction.",
};

const RESULT: ReactionResult = {
  visual: "effervescence",
  liquidColor: "rgba(219,234,254,0.45)", // clear ZnCl₂ solution, faint tint
  description:
    "🫧 Vigorous BUBBLES of H₂ gas rise from the zinc surface. The tube feels WARM (exothermic). The zinc slowly dissolves, forming a clear solution of zinc chloride. Balanced equation: Zn + 2HCl → ZnCl₂ + H₂↑. Test the gas with a burning matchstick — it makes a 'POP' sound.",
};

const NO_REACTION: ReactionResult = {
  visual: "no-reaction",
  liquidColor: "transparent",
  description:
    "Nothing happens. The zinc granules sit unchanged. Try adding an actual reagent (an acid, perhaps) instead of just a trigger.",
};

export const zincHclTest: TestDef = {
  id: "activity-1-2-zinc-hcl",
  name: "Activity 1.2 — Zinc + dilute HCl",
  category: "Chemical Reactions and Equations",
  emoji: "🫧",
  gradient: "from-sky-400 to-blue-500",
  desc: "NCERT Activity 1.2: Add dilute hydrochloric acid to zinc granules. Observe the brisk effervescence of H₂ gas and test it with a burning matchstick (pop sound). Displacement reaction.",
  reagents: [
    { id: "hcl",         name: "dilute HCl",   shortName: "HCl",  accentColor: "#16a34a", liquidColor: "rgba(34,197,94,0.30)",  ringColor: "ring-green-500",   bgColor: "bg-green-50" },
    { id: "heat",        name: "Heat",         shortName: "🔥",   accentColor: "#dc2626", liquidColor: "rgba(239,68,68,0.35)",  ringColor: "ring-red-500",     bgColor: "bg-red-50" },
    { id: "electricity", name: "Electricity",  shortName: "⚡",   accentColor: "#facc15", liquidColor: "rgba(250,204,21,0.35)", ringColor: "ring-yellow-400",  bgColor: "bg-yellow-50" },
    { id: "sunlight",    name: "Sunlight",     shortName: "☀️",   accentColor: "#f59e0b", liquidColor: "rgba(251,191,36,0.35)", ringColor: "ring-amber-400",   bgColor: "bg-amber-50" },
  ],
  unknownTypes: [ACTIVITY_TYPE],
  identifyOptions: ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"],
  getReaction: (_t, _r1, _r2) => NO_REACTION,
  getReactionMulti: (_type, added) => {
    if (added.length === 0) return INITIAL;
    return added.includes("hcl") ? RESULT : NO_REACTION;
  },
  introSteps: [
    { title: "Activity 1.2 Setup", desc: "Place a few zinc granules in a test tube. Keep a burning matchstick ready for the gas test." },
    { title: "Add the Acid", desc: "Which reagent should you add? The activity calls for dilute hydrochloric acid." },
    { title: "Observe Effervescence", desc: "Watch the brisk bubbling at the zinc surface and feel the tube — it should warm up (exothermic)." },
    { title: "Test the Gas", desc: "Bring a burning matchstick to the mouth of the tube. A 'POP' sound confirms H₂ gas. Then classify the reaction." },
  ],
  reactionKey: [
    {
      type: "Displacement Reaction",
      results: [
        "Pattern: A + BC → AC + B (more reactive element displaces less reactive)",
        "Visible signs: colour change + metal deposit OR gas evolution",
        "Examples: Zn + 2HCl → ZnCl₂ + H₂↑,  Fe + CuSO₄ → FeSO₄ + Cu",
      ],
      color: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
  ],
  recap: [
    "Zinc is more reactive than hydrogen, so it displaces hydrogen from dilute HCl. The products are zinc chloride (which stays dissolved in solution) and hydrogen gas (which escapes as bubbles).",
    "The 'pop' sound test is the standard confirmatory test for H₂: a lighted matchstick at the mouth of the tube ignites the H₂, which burns very rapidly with a characteristic pop.",
    "The reaction is exothermic — the tube becomes warm to the touch. This is typical of metal–acid displacement reactions.",
    "The same reaction works with dilute H₂SO₄ in place of HCl. With dilute HNO₃, however, the H₂ gas does NOT escape — HNO₃ is an oxidising acid and converts H₂ into water, releasing nitrogen oxide fumes instead.",
    "Displacement reactions are based on the reactivity series of metals. Any metal above hydrogen in the series (Zn, Fe, Mg, Al, Na, K, Ca) can displace H₂ from dilute acids; metals below hydrogen (Cu, Ag, Au) cannot.",
  ],
};

export const manifest: ExperimentManifest = {
  id: "activity-1-2-zinc-hcl",
  title: "Activity 1.2 — Zinc + dilute HCl",
  emoji: "🫧",
  blurb: "NCERT Activity 1.2: Zn granules + dilute HCl → ZnCl₂ + H₂↑. Brisk effervescence, 'pop' sound test, exothermic displacement reaction.",
  gradient: "from-sky-400 to-blue-500",
  durationMin: 6,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, test: zincHclTest };
export default module;
