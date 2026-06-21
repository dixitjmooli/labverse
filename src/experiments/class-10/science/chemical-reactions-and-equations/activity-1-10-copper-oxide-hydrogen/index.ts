// NCERT Class 10 · Science · Chapter 1 · Activity 1.10
// Copper Oxide + Hydrogen — Reduction of CuO by H₂ (also a Displacement + Redox).
//
// Equation: CuO + H₂ →heat→ Cu + H₂O
// Observation: BLACK powder (CuO) turns RED-BROWN (Cu metal);
//              tiny water droplets condense on the cooler part of the tube.

import type { TestDef, ExperimentManifest, ReactionResult } from "@/lib/lab-types";

const ACTIVITY_TYPE = "Oxidation-Reduction";

const INITIAL: ReactionResult = {
  visual: "precipitate",
  precipitateColor: "#111827", // black CuO powder
  liquidColor: "rgba(255,255,255,0.05)",
  description:
    "Apparatus: A small amount of COPPER OXIDE (CuO — BLACK powder) in a boiling tube, with HYDROGEN GAS (H₂) flowing over it. Apply the right trigger to start the reaction.",
};

const RESULT: ReactionResult = {
  visual: "color-change",
  precipitateColor: "#b91c1c", // red-brown Cu metal
  liquidColor: "rgba(219,234,254,0.45)", // water droplets visible
  description:
    "🔥 When H₂ is passed over HEATED CuO: (1) the BLACK powder turns RED-BROWN (copper metal forms), (2) tiny WATER DROPLETS condense on the cooler part of the tube. Balanced equation: CuO + H₂ →heat→ Cu + H₂O. CuO is REDUCED to Cu; H₂ is OXIDISED to H₂O — this is a REDOX reaction.",
};

const NO_REACTION: ReactionResult = {
  visual: "no-reaction",
  liquidColor: "rgba(255,255,255,0.05)",
  description:
    "Nothing happens. The black powder sits unchanged even with H₂ flowing. What form of energy activates this reaction?",
};

export const copperOxideHydrogenTest: TestDef = {
  id: "activity-1-10-copper-oxide-hydrogen",
  name: "Activity 1.10 — CuO + H₂",
  category: "Chemical Reactions and Equations",
  emoji: "⚫",
  gradient: "from-zinc-700 to-rose-600",
  desc: "NCERT Activity 1.10: Pass hydrogen gas over heated copper oxide (CuO). Observe the colour change (black → red-brown) and the formation of water droplets. Redox reaction (CuO reduced, H₂ oxidised).",
  reagents: [
    { id: "heat",        name: "Heat (Burner)", shortName: "🔥", accentColor: "#dc2626", liquidColor: "rgba(239,68,68,0.35)",  ringColor: "ring-red-500",     bgColor: "bg-red-50" },
    { id: "electricity", name: "Electricity",   shortName: "⚡", accentColor: "#facc15", liquidColor: "rgba(250,204,21,0.35)", ringColor: "ring-yellow-400",  bgColor: "bg-yellow-50" },
    { id: "sunlight",    name: "Sunlight",      shortName: "☀️", accentColor: "#f59e0b", liquidColor: "rgba(251,191,36,0.35)", ringColor: "ring-amber-400",   bgColor: "bg-amber-50" },
    { id: "mix",         name: "Just Stir",     shortName: "🔄", accentColor: "#0ea5e9", liquidColor: "rgba(14,165,233,0.30)", ringColor: "ring-sky-400",     bgColor: "bg-sky-50" },
  ],
  unknownTypes: [ACTIVITY_TYPE],
  identifyOptions: ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"],
  getReaction: (_t, _r1, _r2) => NO_REACTION,
  getReactionMulti: (_type, added) => {
    if (added.length === 0) return INITIAL;
    return added.includes("heat") ? RESULT : NO_REACTION;
  },
  introSteps: [
    { title: "Activity 1.10 Setup", desc: "Place COPPER OXIDE (CuO — BLACK powder) in a boiling tube. Set up a steady flow of HYDROGEN GAS (H₂) over the powder using a delivery tube." },
    { title: "Heat the CuO", desc: "Before lighting the burner, ensure H₂ is flowing freely (to flush out air — H₂ + O₂ mixtures are explosive). Then heat the CuO. Which trigger provides heat?" },
    { title: "Observe Two Changes", desc: "Watch for: (1) the BLACK powder turning RED-BROWN (copper metal), (2) tiny WATER DROPLETS forming on the cooler parts of the tube." },
    { title: "Identify the Redox", desc: "CuO LOSES oxygen (is reduced to Cu); H₂ GAINS oxygen (is oxidised to H₂O). Oxidation and reduction happen together — a REDOX reaction." },
  ],
  reactionKey: [
    {
      type: "Oxidation-Reduction (Redox) Reaction",
      results: [
        "Pattern: Oxidation (loss of e⁻/H, gain of O) + Reduction (gain of e⁻/H, loss of O) happen together",
        "Visible sign: colour change in a solid (often metal oxide → metal)",
        "Examples: CuO + H₂ → Cu + H₂O,  2Fe₂O₃ + 3C → 4Fe + 3CO₂",
      ],
      color: "bg-rose-50",
      textColor: "text-rose-700",
    },
  ],
  recap: [
    "When hydrogen is passed over heated copper oxide, the CuO loses oxygen and is reduced to copper metal. The hydrogen gains that oxygen and is oxidised to water. Reduction and oxidation happen simultaneously — that is the defining feature of a REDOX reaction.",
    "CuO is the OXIDISING AGENT (it gives oxygen to H₂ and gets reduced itself). H₂ is the REDUCING AGENT (it takes oxygen from CuO and gets oxidised itself). The oxidising agent is always reduced; the reducing agent is always oxidised.",
    "This reaction is also a DISPLACEMENT reaction in a broader sense — hydrogen displaces copper from its oxide. The same pattern (metal oxide + reducing agent → metal) is used industrially to extract metals from their ores, e.g., Fe₂O₃ + 3CO → 2Fe + 3CO₂ in a blast furnace.",
    "The water droplets on the cooler part of the tube are the giveaway that water is one of the products. If you collected and tested them, they would turn white anhydrous CuSO₄ blue — the standard test for water.",
    "Safety: hydrogen + air mixtures are explosive. Always flush the tube with H₂ for a few seconds BEFORE lighting the burner, and never light the H₂ itself as it exits the tube (use a flame arrestor or let it disperse safely).",
  ],
};

export const manifest: ExperimentManifest = {
  id: "activity-1-10-copper-oxide-hydrogen",
  title: "Activity 1.10 — CuO + H₂",
  emoji: "⚫",
  blurb: "NCERT Activity 1.10: CuO + H₂ → Cu + H₂O. Black powder turns red-brown; water droplets form. CuO reduced, H₂ oxidised — redox reaction.",
  gradient: "from-zinc-700 to-rose-600",
  durationMin: 7,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, test: copperOxideHydrogenTest };
export default module;
