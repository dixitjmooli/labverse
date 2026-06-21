// NCERT Class 10 · Science · Chapter 1 · Activity 1.1
// Burning of a Magnesium Ribbon in air — a classic Combination reaction.
//
// Equation: 2Mg + O₂ → 2MgO
// Observation: dazzling white flame, white ash (MgO) left behind.
// NCERT note: also an oxidation reaction (Mg gains oxygen).

import type { TestDef, ExperimentManifest, ReactionResult } from "@/lib/lab-types";

const ACTIVITY_TYPE = "Combination";

const INITIAL: ReactionResult = {
  visual: "precipitate",
  precipitateColor: "#cbd5e1", // grey-silver Mg ribbon sitting in the tube
  liquidColor: "transparent",
  description:
    "Apparatus: A piece of MAGNESIUM RIBBON (grey-silver metal) held with tongs over a spirit lamp. Apply the right trigger to start the reaction.",
};

const RESULT: ReactionResult = {
  visual: "color-change",
  precipitateColor: "#f8fafc", // white MgO ash
  liquidColor: "rgba(255,255,255,0.10)",
  description:
    "🔥 The magnesium ribbon burns with a DAZZLING WHITE FLAME, leaving behind a powdery WHITE ASH (MgO).  Balanced equation: 2Mg + O₂ → 2MgO.  ⚠️ Do NOT look directly at the flame — it can damage your eyes.",
};

const NO_REACTION: ReactionResult = {
  visual: "no-reaction",
  liquidColor: "transparent",
  description:
    "Nothing happens. The magnesium ribbon sits unchanged. Try a different trigger — what does the activity ask you to do to the ribbon?",
};

export const burningMagnesiumTest: TestDef = {
  id: "activity-1-1-burning-magnesium",
  name: "Activity 1.1 — Burning Magnesium",
  category: "Chemical Reactions and Equations",
  emoji: "🔥",
  gradient: "from-amber-400 to-orange-500",
  desc: "NCERT Activity 1.1: Hold a magnesium ribbon with tongs and ignite it. Observe the dazzling white flame and the white ash (MgO) formed. Classify the reaction.",
  reagents: [
    { id: "heat",       name: "Ignite (Spirit Lamp)", shortName: "🔥", accentColor: "#dc2626", liquidColor: "rgba(239,68,68,0.35)",  ringColor: "ring-red-500",     bgColor: "bg-red-50" },
    { id: "electricity", name: "Electricity",         shortName: "⚡", accentColor: "#facc15", liquidColor: "rgba(250,204,21,0.35)", ringColor: "ring-yellow-400",  bgColor: "bg-yellow-50" },
    { id: "sunlight",   name: "Sunlight",             shortName: "☀️", accentColor: "#f59e0b", liquidColor: "rgba(251,191,36,0.35)", ringColor: "ring-amber-400",   bgColor: "bg-amber-50" },
    { id: "mix",        name: "Just Stir",            shortName: "🔄", accentColor: "#0ea5e9", liquidColor: "rgba(14,165,233,0.30)", ringColor: "ring-sky-400",     bgColor: "bg-sky-50" },
  ],
  unknownTypes: [ACTIVITY_TYPE],
  identifyOptions: ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"],
  getReaction: (_t, _r1, _r2) => NO_REACTION,
  getReactionMulti: (_type, added) => {
    if (added.length === 0) return INITIAL;
    return added.includes("heat") ? RESULT : NO_REACTION;
  },
  introSteps: [
    { title: "Activity 1.1 Setup", desc: "Hold a 2 cm piece of magnesium ribbon with a pair of tongs. Keep it away from your face." },
    { title: "Apply Heat", desc: "Ignite the ribbon using a spirit lamp or burner. Which trigger is correct here?" },
    { title: "Observe Carefully", desc: "Watch the colour of the flame and the substance left behind. ⚠️ Do NOT stare at the flame — it is intensely bright." },
    { title: "Classify the Reaction", desc: "Two elements (Mg + O₂) combine to form a single product (MgO). What type of reaction is this?" },
  ],
  reactionKey: [
    {
      type: "Combination Reaction",
      results: [
        "Pattern: A + B → AB (two or more reactants form ONE product)",
        "Often exothermic (heat/light released)",
        "Examples: 2Mg + O₂ → 2MgO, CaO + H₂O → Ca(OH)₂, burning of fuels",
      ],
      color: "bg-amber-50",
      textColor: "text-amber-700",
    },
  ],
  recap: [
    "Magnesium burns in air to form magnesium oxide (MgO) — a combination reaction because two elements (Mg + O₂) combine into a single compound (MgO).",
    "The dazzling white flame is the energy released as the new Mg–O bonds form. The same bright light is why magnesium is used in fireworks, flares, and old-style camera flashbulbs.",
    "Since magnesium gains oxygen during this reaction, it is also an OXIDATION reaction. A combination reaction can also be an oxidation (or reduction) — the two classifications are not mutually exclusive.",
    "The white ash (MgO) is basic in nature. If you dissolve it in water and test with red litmus, the litmus will turn blue.",
    "Safety: never look directly at a burning magnesium ribbon — the UV-rich white light can permanently damage your retina. Use tongs, not bare fingers, and perform the activity in a well-ventilated lab.",
  ],
};

export const manifest: ExperimentManifest = {
  id: "activity-1-1-burning-magnesium",
  title: "Activity 1.1 — Burning Magnesium Ribbon",
  emoji: "🔥",
  blurb: "NCERT Activity 1.1: Ignite a magnesium ribbon, observe the dazzling white flame and white MgO ash. Combination + oxidation reaction.",
  gradient: "from-amber-400 to-orange-500",
  durationMin: 5,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, test: burningMagnesiumTest };
export default module;
