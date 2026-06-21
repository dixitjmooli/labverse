// NCERT Class 10 · Science · Chapter 1 · Activity 1.6
// Silver Chloride (AgCl) in sunlight — Photolytic Decomposition.
//
// Equation: 2AgCl →sunlight→ 2Ag + Cl₂↑
// Observation: white powder slowly turns GREY (silver metal forms),
//              chlorine gas released. This is the basis of black-and-white photography.

import type { TestDef, ExperimentManifest, ReactionResult } from "@/lib/lab-types";

const ACTIVITY_TYPE = "Decomposition";

const INITIAL: ReactionResult = {
  visual: "precipitate",
  precipitateColor: "#f8fafc", // white AgCl powder
  liquidColor: "transparent",
  description:
    "Apparatus: A small amount of SILVER CHLORIDE (AgCl — WHITE powder) in a watch glass or Petri dish. Apply the right trigger to start the reaction.",
};

const RESULT: ReactionResult = {
  visual: "color-change",
  precipitateColor: "#6b7280", // grey silver metal powder
  liquidColor: "rgba(255,255,255,0.10)",
  description:
    "☀️ The white AgCl powder slowly turns GREY as SILVER METAL forms. Chlorine gas is also released. Balanced equation: 2AgCl →sunlight→ 2Ag + Cl₂↑. This is the basis of traditional black-and-white photography.",
};

const NO_REACTION: ReactionResult = {
  visual: "no-reaction",
  liquidColor: "transparent",
  description:
    "Nothing happens. The white powder sits unchanged. What form of energy — other than heat or electricity — can decompose silver chloride?",
};

export const silverChlorideSunlightTest: TestDef = {
  id: "activity-1-6-silver-chloride-sunlight",
  name: "Activity 1.6 — Silver Chloride in Sunlight",
  category: "Chemical Reactions and Equations",
  emoji: "☀️",
  gradient: "from-yellow-300 to-amber-500",
  desc: "NCERT Activity 1.6: Take silver chloride (AgCl) in a watch glass and place it in sunlight. Observe the white powder turn grey as silver metal forms. Photolytic decomposition reaction.",
  reagents: [
    { id: "sunlight",    name: "Sunlight",      shortName: "☀️", accentColor: "#f59e0b", liquidColor: "rgba(251,191,36,0.55)", ringColor: "ring-amber-400",   bgColor: "bg-amber-50" },
    { id: "heat",        name: "Heat",          shortName: "🔥", accentColor: "#dc2626", liquidColor: "rgba(239,68,68,0.35)",  ringColor: "ring-red-500",     bgColor: "bg-red-50" },
    { id: "electricity", name: "Electricity",   shortName: "⚡", accentColor: "#facc15", liquidColor: "rgba(250,204,21,0.35)", ringColor: "ring-yellow-400",  bgColor: "bg-yellow-50" },
    { id: "water",       name: "Add Water",     shortName: "H₂O", accentColor: "#0ea5e9", liquidColor: "rgba(14,165,233,0.35)", ringColor: "ring-sky-400",     bgColor: "bg-sky-50" },
  ],
  unknownTypes: [ACTIVITY_TYPE],
  identifyOptions: ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"],
  getReaction: (_t, _r1, _r2) => NO_REACTION,
  getReactionMulti: (_type, added) => {
    if (added.length === 0) return INITIAL;
    return added.includes("sunlight") ? RESULT : NO_REACTION;
  },
  introSteps: [
    { title: "Activity 1.6 Setup", desc: "Take about 2 g of silver chloride (AgCl) in a watch glass or Petri dish. The powder is white and insoluble in water." },
    { title: "Place in Sunlight", desc: "Place the watch glass in bright sunlight for 15-30 minutes. Which trigger represents this?" },
    { title: "Observe the Colour", desc: "Watch the white powder slowly turn GREY — this is metallic silver forming. The change is gradual, not instant." },
    { title: "Connect to Photography", desc: "The same reaction with AgBr (silver bromide) is what captures an image on traditional photographic film. Then classify the reaction." },
  ],
  reactionKey: [
    {
      type: "Decomposition Reaction (Photolytic)",
      results: [
        "Pattern: AB → A + B (ONE reactant breaks into two or more products)",
        "Driven by LIGHT energy (sunlight)",
        "Examples: 2AgCl →sunlight→ 2Ag + Cl₂,  2AgBr → 2Ag + Br₂",
      ],
      color: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ],
  recap: [
    "Silver chloride (AgCl) decomposes into silver (Ag) and chlorine (Cl₂) when exposed to sunlight. The white powder gradually turns grey because metallic silver is grey.",
    "This is a PHOTOLYTIC decomposition — the energy required to break the Ag–Cl bond comes from photons of light, not from heat or electricity. It is the third type of decomposition reaction (alongside thermal and electrolytic).",
    "Silver BROMIDE (AgBr) behaves similarly and is the actual compound used in traditional black-and-white photographic film. When light hits the film, tiny crystals of AgBr decompose into silver metal — the more light, the more silver, which is what creates the image.",
    "Silver iodide (AgI) is also light-sensitive and is used in cloud seeding — dispersing AgI crystals into clouds encourages water droplets to form, inducing rain.",
    "Photolytic reactions are slower than thermal reactions because the energy delivered per photon is small. The colour change here is gradual — patience (and bright sunlight) is needed.",
  ],
};

export const manifest: ExperimentManifest = {
  id: "activity-1-6-silver-chloride-sunlight",
  title: "Activity 1.6 — Silver Chloride in Sunlight",
  emoji: "☀️",
  blurb: "NCERT Activity 1.6: 2AgCl → 2Ag + Cl₂. White powder turns grey in sunlight. Photolytic decomposition — basis of black-and-white photography.",
  gradient: "from-yellow-300 to-amber-500",
  durationMin: 8,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, test: silverChlorideSunlightTest };
export default module;
