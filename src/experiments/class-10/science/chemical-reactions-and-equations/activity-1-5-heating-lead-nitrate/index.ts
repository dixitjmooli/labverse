// NCERT Class 10 · Science · Chapter 1 · Activity 1.5
// Heating of Lead Nitrate crystals — Thermal Decomposition.
//
// Equation: 2Pb(NO₃)₂ →heat→ 2PbO + 4NO₂↑ + O₂↑
// Observation: white crystals → yellow residue (PbO) + BROWN fumes (NO₂) +
//              oxygen (rekindles glowing splint).

import type { TestDef, ExperimentManifest, ReactionResult } from "@/lib/lab-types";

const ACTIVITY_TYPE = "Decomposition";

const INITIAL: ReactionResult = {
  visual: "precipitate",
  precipitateColor: "#f8fafc", // white Pb(NO₃)₂ crystals
  liquidColor: "transparent",
  description:
    "Apparatus: A small amount of LEAD NITRATE crystals (Pb(NO₃)₂ — WHITE crystals) in a dry boiling tube. Apply the right trigger to start the reaction. ⚠️ Do this in a fume hood — the fumes are toxic.",
};

const RESULT: ReactionResult = {
  visual: "color-change",
  precipitateColor: "#eab308", // yellow PbO residue
  liquidColor: "rgba(120,53,15,0.55)", // brown NO₂ fumes filling the tube
  description:
    "🔥 The white crystals decompose. BROWN FUMES of nitrogen dioxide (NO₂) evolve vigorously. A YELLOW residue of lead oxide (PbO) remains. Oxygen is also released — it rekindles a glowing splint. Balanced equation: 2Pb(NO₃)₂ →heat→ 2PbO + 4NO₂↑ + O₂↑.",
};

const NO_REACTION: ReactionResult = {
  visual: "no-reaction",
  liquidColor: "transparent",
  description:
    "Nothing happens. The white crystals sit unchanged. What form of energy decomposes a stable nitrate salt?",
};

export const heatingLeadNitrateTest: TestDef = {
  id: "activity-1-5-heating-lead-nitrate",
  name: "Activity 1.5 — Heating Lead Nitrate",
  category: "Chemical Reactions and Equations",
  emoji: "🟤",
  gradient: "from-amber-400 to-yellow-600",
  desc: "NCERT Activity 1.5: Heat lead nitrate powder in a boiling tube. Observe the brown fumes (NO₂), the yellow residue (PbO), and the release of oxygen. Thermal decomposition reaction.",
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
    { title: "Activity 1.5 Setup", desc: "Take a small amount of lead nitrate [Pb(NO₃)₂] powder in a dry boiling tube. ⚠️ Do this in a fume hood — NO₂ is toxic." },
    { title: "Heat the Powder", desc: "Hold the tube with a clamp and heat it over a burner. Which trigger provides heat?" },
    { title: "Observe Brown Fumes", desc: "Watch for: (1) BROWN FUMES of NO₂ gas evolving, (2) a YELLOW residue (PbO) forming, (3) oxygen released (rekindles a glowing splint)." },
    { title: "Classify the Reaction", desc: "A single reactant (Pb(NO₃)₂) breaks into multiple products. What type of reaction is this?" },
  ],
  reactionKey: [
    {
      type: "Decomposition Reaction",
      results: [
        "Pattern: AB → A + B (ONE reactant breaks into two or more products)",
        "Requires energy: heat / electricity / sunlight",
        "Examples: 2Pb(NO₃)₂ → 2PbO + 4NO₂ + O₂,  CaCO₃ → CaO + CO₂",
      ],
      color: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ],
  recap: [
    "Lead nitrate [Pb(NO₃)₂] is a white crystalline salt. On heating, it decomposes into three products: lead oxide (PbO, a yellow residue), nitrogen dioxide (NO₂, brown fumes), and oxygen gas (O₂).",
    "The BROWN FUMES are the unmistakable signature of NO₂. Nitrogen dioxide is a toxic, pungent gas — that's why this activity must be performed in a fume hood.",
    "The oxygen released can be confirmed by bringing a GLOWING (not burning) splint to the mouth of the tube — it REKINDLES in the oxygen-rich atmosphere. This is the standard test for oxygen.",
    "Lead oxide (PbO) exists in two forms: litharge (red, stable at lower temperatures) and massicot (yellow, stable at higher temperatures). The yellow colour seen here is massicot.",
    "All nitrate salts decompose on heating, but the products vary: alkali metal nitrates (like NaNO₃, KNO₃) give only the nitrite + O₂, while heavy-metal nitrates (like Pb(NO₃)₂, Cu(NO₃)₂) give the oxide + NO₂ + O₂.",
  ],
};

export const manifest: ExperimentManifest = {
  id: "activity-1-5-heating-lead-nitrate",
  title: "Activity 1.5 — Heating Lead Nitrate",
  emoji: "🟤",
  blurb: "NCERT Activity 1.5: 2Pb(NO₃)₂ → 2PbO + 4NO₂ + O₂. White crystals → brown NO₂ fumes + yellow PbO residue. Thermal decomposition.",
  gradient: "from-amber-400 to-yellow-600",
  durationMin: 6,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, test: heatingLeadNitrateTest };
export default module;
