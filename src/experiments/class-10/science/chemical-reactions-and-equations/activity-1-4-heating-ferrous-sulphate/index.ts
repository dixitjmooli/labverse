// NCERT Class 10 · Science · Chapter 1 · Activity 1.4
// Heating of Ferrous Sulphate crystals (FeSO₄·7H₂O) — Thermal Decomposition.
//
// Equation: 2FeSO₄ →heat→ Fe₂O₃ + SO₂↑ + SO₃↑
// Observation: pale green crystals → white (anhydrous) → reddish-brown residue,
//              characteristic smell of burning sulphur (SO₂ + SO₃ gases).

import type { TestDef, ExperimentManifest, ReactionResult } from "@/lib/lab-types";

const ACTIVITY_TYPE = "Decomposition";

const INITIAL: ReactionResult = {
  visual: "precipitate",
  precipitateColor: "#86efac", // pale green FeSO₄·7H₂O crystals
  liquidColor: "transparent",
  description:
    "Apparatus: A small amount of FERROUS SULPHATE crystals (FeSO₄·7H₂O — pale GREEN crystals) in a dry boiling tube. Apply the right trigger to start the reaction.",
};

const RESULT: ReactionResult = {
  visual: "color-change",
  precipitateColor: "#b91c1c", // reddish-brown Fe₂O₃ residue
  liquidColor: "rgba(255,255,255,0.05)",
  description:
    "🔥 The pale GREEN crystals first lose water and turn WHITE, then decompose into a REDDISH-BROWN residue (Fe₂O₃). A characteristic smell of BURNING SULPHUR fills the air (SO₂ and SO₃ gases). Balanced equation: 2FeSO₄ →heat→ Fe₂O₃ + SO₂↑ + SO₃↑.",
};

const NO_REACTION: ReactionResult = {
  visual: "no-reaction",
  liquidColor: "transparent",
  description:
    "Nothing happens. The green crystals sit unchanged. What form of energy is needed to decompose a stable salt like ferrous sulphate?",
};

export const heatingFerrousSulphateTest: TestDef = {
  id: "activity-1-4-heating-ferrous-sulphate",
  name: "Activity 1.4 — Heating Ferrous Sulphate",
  category: "Chemical Reactions and Equations",
  emoji: "🌡️",
  gradient: "from-emerald-400 to-rose-500",
  desc: "NCERT Activity 1.4: Heat a small amount of ferrous sulphate crystals (FeSO₄·7H₂O) in a dry boiling tube. Observe the colour change (green → reddish-brown) and the smell of burning sulphur. Thermal decomposition reaction.",
  reagents: [
    { id: "heat",        name: "Heat (Burner)", shortName: "🔥", accentColor: "#dc2626", liquidColor: "rgba(239,68,68,0.35)",  ringColor: "ring-red-500",     bgColor: "bg-red-50" },
    { id: "electricity", name: "Electricity",   shortName: "⚡", accentColor: "#facc15", liquidColor: "rgba(250,204,21,0.35)", ringColor: "ring-yellow-400",  bgColor: "bg-yellow-50" },
    { id: "sunlight",    name: "Sunlight",      shortName: "☀️", accentColor: "#f59e0b", liquidColor: "rgba(251,191,36,0.35)", ringColor: "ring-amber-400",   bgColor: "bg-amber-50" },
    { id: "water",       name: "Add Water",     shortName: "H₂O", accentColor: "#0ea5e9", liquidColor: "rgba(14,165,233,0.35)", ringColor: "ring-sky-400",     bgColor: "bg-sky-50" },
  ],
  unknownTypes: [ACTIVITY_TYPE],
  identifyOptions: ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"],
  getReaction: (_t, _r1, _r2) => NO_REACTION,
  getReactionMulti: (_type, added) => {
    if (added.length === 0) return INITIAL;
    return added.includes("heat") ? RESULT : NO_REACTION;
  },
  introSteps: [
    { title: "Activity 1.4 Setup", desc: "Take a small amount of ferrous sulphate crystals (FeSO₄·7H₂O) in a DRY boiling tube. Note their pale GREEN colour." },
    { title: "Heat the Crystals", desc: "Hold the tube with a clamp and heat it gently, then strongly, over a burner. Which trigger provides heat?" },
    { title: "Observe the Colour Change", desc: "Watch for two stages: (1) green → white (water of crystallisation lost), (2) white → reddish-brown (decomposition)." },
    { title: "Note the Smell", desc: "Carefully fan the gas towards your nose — a smell of burning sulphur confirms SO₂ and SO₃ evolution. Then classify the reaction." },
  ],
  reactionKey: [
    {
      type: "Decomposition Reaction",
      results: [
        "Pattern: AB → A + B (ONE reactant breaks into two or more products)",
        "Requires energy input: heat / electricity / sunlight",
        "Examples: 2FeSO₄ →heat→ Fe₂O₃ + SO₂ + SO₃,  CaCO₃ →heat→ CaO + CO₂",
      ],
      color: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ],
  recap: [
    "Ferrous sulphate crystals (FeSO₄·7H₂O) contain water of crystallisation, which gives them their pale green colour. On gentle heating, this water is driven off first (the crystals turn white).",
    "On stronger heating, the anhydrous FeSO₄ decomposes into ferric oxide (Fe₂O₃, reddish-brown), sulphur dioxide (SO₂), and sulphur trioxide (SO₃). All three products are different from the single reactant — this is a thermal decomposition reaction.",
    "The SO₂ and SO₃ gases have a characteristic choking smell of burning sulphur. They are acidic oxides: if you bubble them through water, they form sulphurous acid (H₂SO₃) and sulphuric acid (H₂SO₄) respectively.",
    "Ferric oxide (Fe₂O₃) is the same compound as rust (the reddish-brown coating on iron). It is used as a red pigment in paints and as 'jeweller's rouge' for polishing glass and metals.",
    "Decomposition reactions require an input of energy (heat, electricity, or light) — they are ENDOTHERMIC. The reverse process (combination) typically releases energy.",
  ],
};

export const manifest: ExperimentManifest = {
  id: "activity-1-4-heating-ferrous-sulphate",
  title: "Activity 1.4 — Heating Ferrous Sulphate",
  emoji: "🌡️",
  blurb: "NCERT Activity 1.4: 2FeSO₄ → Fe₂O₃ + SO₂ + SO₃. Green crystals turn reddish-brown; smell of burning sulphur. Thermal decomposition.",
  gradient: "from-emerald-400 to-rose-500",
  durationMin: 6,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, test: heatingFerrousSulphateTest };
export default module;
