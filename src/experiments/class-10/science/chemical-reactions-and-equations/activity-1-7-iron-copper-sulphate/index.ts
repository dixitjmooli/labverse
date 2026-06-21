// NCERT Class 10 · Science · Chapter 1 · Activity 1.7
// Iron nail immersed in Copper Sulphate solution — Displacement reaction.
//
// Equation: Fe + CuSO₄ → FeSO₄ + Cu
// Observation: blue solution fades to pale GREEN, a BROWN layer of Cu metal
//              deposits on the iron nail. Iron is more reactive than copper.

import type { TestDef, ExperimentManifest, ReactionResult } from "@/lib/lab-types";

const ACTIVITY_TYPE = "Displacement";

const INITIAL: ReactionResult = {
  visual: "precipitate",
  precipitateColor: "#94a3b8", // grey iron nail
  liquidColor: "rgba(37,99,235,0.55)", // blue CuSO₄ solution
  description:
    "Apparatus: An IRON NAIL (grey) immersed in COPPER SULPHATE solution (CuSO₄ — bright BLUE). Apply the right trigger to let the reaction proceed.",
};

const RESULT: ReactionResult = {
  visual: "precipitate",
  precipitateColor: "#7c2d12", // brown Cu deposit on nail
  liquidColor: "rgba(34,197,94,0.45)", // pale green FeSO₄ solution
  description:
    "🔄 Over a few minutes: (1) The blue solution fades to PALE GREEN (FeSO₄ forms). (2) A BROWN layer of COPPER METAL deposits on the iron nail. Balanced equation: Fe + CuSO₄ → FeSO₄ + Cu. Iron is more reactive than copper — it displaces Cu from its salt.",
};

const NO_REACTION: ReactionResult = {
  visual: "no-reaction",
  liquidColor: "rgba(37,99,235,0.55)",
  description:
    "Nothing happens — the nail just sits in the blue solution. Try letting some time pass (the displacement needs contact time).",
};

export const ironCopperSulphateTest: TestDef = {
  id: "activity-1-7-iron-copper-sulphate",
  name: "Activity 1.7 — Iron Nail in CuSO₄",
  category: "Chemical Reactions and Equations",
  emoji: "🔵",
  gradient: "from-blue-500 to-emerald-500",
  desc: "NCERT Activity 1.7: Take an iron nail and dip it in copper sulphate solution. Observe the colour change (blue → green) and the brown copper deposit on the nail. Displacement reaction.",
  reagents: [
    { id: "mix",        name: "Wait / Stir",   shortName: "🔄", accentColor: "#0ea5e9", liquidColor: "rgba(14,165,233,0.30)", ringColor: "ring-sky-400",     bgColor: "bg-sky-50" },
    { id: "heat",       name: "Heat",          shortName: "🔥", accentColor: "#dc2626", liquidColor: "rgba(239,68,68,0.35)",  ringColor: "ring-red-500",     bgColor: "bg-red-50" },
    { id: "electricity", name: "Electricity",  shortName: "⚡", accentColor: "#facc15", liquidColor: "rgba(250,204,21,0.35)", ringColor: "ring-yellow-400",  bgColor: "bg-yellow-50" },
    { id: "sunlight",   name: "Sunlight",      shortName: "☀️", accentColor: "#f59e0b", liquidColor: "rgba(251,191,36,0.35)", ringColor: "ring-amber-400",   bgColor: "bg-amber-50" },
  ],
  unknownTypes: [ACTIVITY_TYPE],
  identifyOptions: ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"],
  getReaction: (_t, _r1, _r2) => NO_REACTION,
  getReactionMulti: (_type, added) => {
    if (added.length === 0) return INITIAL;
    return added.includes("mix") ? RESULT : NO_REACTION;
  },
  introSteps: [
    { title: "Activity 1.7 Setup", desc: "Take a clean IRON NAIL (rub with sandpaper to remove any rust/oil) and tie a thread to it. Pour some copper sulphate solution (CuSO₄ — bright BLUE) into a beaker." },
    { title: "Immerse the Nail", desc: "Lower the nail into the CuSO₄ solution. The reaction needs contact time — let it sit. Which trigger represents 'wait'?" },
    { title: "Observe Two Changes", desc: "After 10-15 minutes: (1) the BLUE solution fades to PALE GREEN (FeSO₄), (2) a BROWN layer of COPPER deposits on the nail." },
    { title: "Compare with the Reverse", desc: "If you dipped a COPPER wire in FeSO₄ solution, nothing would happen — copper cannot displace iron. Iron is more reactive. Then classify the reaction." },
  ],
  reactionKey: [
    {
      type: "Displacement Reaction",
      results: [
        "Pattern: A + BC → AC + B (more reactive metal displaces less reactive metal)",
        "Visible signs: colour change of solution + metal deposit",
        "Examples: Fe + CuSO₄ → FeSO₄ + Cu,  Zn + CuSO₄ → ZnSO₄ + Cu",
      ],
      color: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
  ],
  recap: [
    "Iron is ABOVE copper in the reactivity series, so iron can displace copper from copper sulphate solution. The products are iron(II) sulphate (FeSO₄ — pale green in solution) and copper metal (brown deposit on the nail).",
    "The colour change is the key clue: CuSO₄ solution is BLUE because of the Cu²⁺ ion, but FeSO₄ solution is PALE GREEN because of the Fe²⁺ ion. The change from blue to green tells you the ions in solution have swapped.",
    "The copper metal forms a thin brown coating on the iron nail because the displaced Cu atoms stick to the surface where the Fe atoms dissolved. If you scrape the nail after some time, the brown layer comes off as flakes of metallic copper.",
    "The reverse reaction (Cu + FeSO₄ → nothing) does NOT happen — copper is less reactive than iron and cannot displace it. This is the practical meaning of the reactivity series: a metal can only displace metals BELOW it.",
    "Other metals above copper (Zn, Mg, Al) would also displace Cu from CuSO₄, often faster than iron does. Zinc gives a colourless solution (ZnSO₄); magnesium and aluminium also displace Cu vigorously.",
  ],
};

export const manifest: ExperimentManifest = {
  id: "activity-1-7-iron-copper-sulphate",
  title: "Activity 1.7 — Iron Nail in CuSO₄",
  emoji: "🔵",
  blurb: "NCERT Activity 1.7: Fe + CuSO₄ → FeSO₄ + Cu. Blue solution fades to green, brown Cu deposit on the iron nail. Displacement reaction.",
  gradient: "from-blue-500 to-emerald-500",
  durationMin: 7,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, test: ironCopperSulphateTest };
export default module;
