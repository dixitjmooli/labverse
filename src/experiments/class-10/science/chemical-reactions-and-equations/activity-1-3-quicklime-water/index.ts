// NCERT Class 10 · Science · Chapter 1 · Activity 1.3
// Quicklime (CaO) + Water — Combination reaction (exothermic).
//
// Equation: CaO + H₂O → Ca(OH)₂
// Observation: vigorous hissing sound, tube gets very hot, white suspension
//              of Ca(OH)₂ (slaked lime); turns red litmus blue (basic).

import type { TestDef, ExperimentManifest, ReactionResult } from "@/lib/lab-types";

const ACTIVITY_TYPE = "Combination";

const INITIAL: ReactionResult = {
  visual: "precipitate",
  precipitateColor: "#f8fafc", // white CaO (quicklime) powder
  liquidColor: "rgba(255,255,255,0.10)",
  description:
    "Apparatus: A small amount of QUICKLIME (CaO — white powder) in a beaker. Add the right reagent to start the reaction. Be careful — the reaction is highly exothermic.",
};

const RESULT: ReactionResult = {
  visual: "color-change",
  liquidColor: "rgba(248,250,252,0.92)", // cloudy white Ca(OH)₂ suspension
  description:
    "🔥 A VIGOROUS reaction with a HISSING SOUND. The beaker becomes VERY HOT (exothermic). A cloudy WHITE suspension of calcium hydroxide (slaked lime) forms. Balanced equation: CaO + H₂O → Ca(OH)₂. If you dip red litmus in the suspension, it turns BLUE — slaked lime is basic.",
};

const NO_REACTION: ReactionResult = {
  visual: "no-reaction",
  liquidColor: "rgba(255,255,255,0.10)",
  description:
    "Nothing happens. The quicklime powder sits unchanged. Try adding a real reagent — what does the activity say to add to quicklime?",
};

export const quicklimeWaterTest: TestDef = {
  id: "activity-1-3-quicklime-water",
  name: "Activity 1.3 — Quicklime + Water",
  category: "Chemical Reactions and Equations",
  emoji: "🪨",
  gradient: "from-slate-400 to-zinc-500",
  desc: "NCERT Activity 1.3: Add water to a small amount of quicklime (CaO). Observe the vigorous exothermic reaction and the formation of slaked lime [Ca(OH)₂] suspension. Combination reaction.",
  reagents: [
    { id: "water",       name: "Water",         shortName: "H₂O", accentColor: "#0ea5e9", liquidColor: "rgba(14,165,233,0.35)", ringColor: "ring-sky-400",     bgColor: "bg-sky-50" },
    { id: "heat",        name: "Heat",          shortName: "🔥",  accentColor: "#dc2626", liquidColor: "rgba(239,68,68,0.35)",  ringColor: "ring-red-500",     bgColor: "bg-red-50" },
    { id: "electricity", name: "Electricity",   shortName: "⚡",  accentColor: "#facc15", liquidColor: "rgba(250,204,21,0.35)", ringColor: "ring-yellow-400",  bgColor: "bg-yellow-50" },
    { id: "sunlight",    name: "Sunlight",      shortName: "☀️",  accentColor: "#f59e0b", liquidColor: "rgba(251,191,36,0.35)", ringColor: "ring-amber-400",   bgColor: "bg-amber-50" },
  ],
  unknownTypes: [ACTIVITY_TYPE],
  identifyOptions: ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"],
  getReaction: (_t, _r1, _r2) => NO_REACTION,
  getReactionMulti: (_type, added) => {
    if (added.length === 0) return INITIAL;
    return added.includes("water") ? RESULT : NO_REACTION;
  },
  introSteps: [
    { title: "Activity 1.3 Setup", desc: "Take a small amount of quicklime (calcium oxide, CaO) in a beaker. The powder is white and slightly caustic — handle with care." },
    { title: "Add Water Slowly", desc: "The activity calls for adding water to quicklime. Which reagent does that?" },
    { title: "Observe Vigorously", desc: "Watch for: (1) a hissing sound, (2) the beaker getting hot, (3) the formation of a white suspension." },
    { title: "Test the Product", desc: "Dip red litmus paper into the suspension — it should turn blue, confirming the product is basic. Then classify the reaction." },
  ],
  reactionKey: [
    {
      type: "Combination Reaction",
      results: [
        "Pattern: A + B → AB (two reactants form ONE product)",
        "Often exothermic (heat released)",
        "Examples: CaO + H₂O → Ca(OH)₂, 2Mg + O₂ → 2MgO, burning of coal",
      ],
      color: "bg-amber-50",
      textColor: "text-amber-700",
    },
  ],
  recap: [
    "Calcium oxide (quicklime, CaO) reacts vigorously with water to form calcium hydroxide (slaked lime, Ca(OH)₂). This is a combination reaction — two reactants form a single product.",
    "The reaction is highly EXOTHERMIC. So much heat is released that the water can hiss and partially boil on contact. This is why quicklime must be added to water SLOWLY, never the other way around.",
    "Slaked lime [Ca(OH)₂] is only slightly soluble in water, so most of it stays suspended — giving the mixture its cloudy white appearance. The clear liquid above (lime water) is a dilute solution of Ca(OH)₂.",
    "Slaked lime is widely used: in whitewashing walls (it slowly reacts with CO₂ in the air to form a hard shiny layer of CaCO₃), in making cement and mortar, in tanning leather, and to neutralise acidic soils.",
    "Safety: always add quicklime TO water, never water TO quicklime. Adding water to a large mass of quicklime can cause explosive boiling and splattering of caustic material.",
  ],
};

export const manifest: ExperimentManifest = {
  id: "activity-1-3-quicklime-water",
  title: "Activity 1.3 — Quicklime + Water",
  emoji: "🪨",
  blurb: "NCERT Activity 1.3: CaO + H₂O → Ca(OH)₂. Vigorous exothermic combination reaction. Slaked lime suspension turns red litmus blue.",
  gradient: "from-slate-400 to-zinc-500",
  durationMin: 5,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, test: quicklimeWaterTest };
export default module;
