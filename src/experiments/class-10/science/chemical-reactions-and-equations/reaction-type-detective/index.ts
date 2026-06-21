// Self-contained experiment module — Class 10 · Science · Chemical Reactions and Equations
// Game: "Reaction Type Detective" — Five mystery reactions, one of each NCERT type.
// Add the correct TRIGGER to each tube to make it react, observe the products,
// then classify each as:
//   Combination | Decomposition | Displacement | Double Displacement | Oxidation-Reduction
//
// NCERT Class 10 Chapter 1 reaction types covered:
//   1. Combination        — CaO + H₂O → Ca(OH)₂   (exothermic, mix trigger)
//   2. Decomposition      — CaCO₃ → CaO + CO₂      (thermal, heat trigger)
//   3. Displacement       — Fe + CuSO₄ → FeSO₄ + Cu (mix trigger)
//   4. Double Displacement— Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl (mix trigger)
//   5. Redox              — CuO + H₂ → Cu + H₂O     (heat trigger)
//
// Each tube shows its reactants (liquidColor + description) before any trigger
// is added — the player's `createTubes` helper respects non-empty initial states.
//
// Trigger reagents: Heat 🔥, Electricity ⚡, Sunlight ☀️, Mix 🔄
// Wrong trigger = no reaction. Right trigger = reaction proceeds and "sticks"
// (later wrong triggers do not undo a successful reaction).

import type { TestDef, ExperimentManifest, ReactionResult, ReactionVisual } from "@/lib/lab-types";

// ─── Trigger → Reaction type mapping ─────────────────────────────────────────
// The ONE correct trigger that initiates each reaction.
const CORRECT_TRIGGER: Record<string, string> = {
  "Combination":          "mix",
  "Decomposition":        "heat",
  "Displacement":         "mix",
  "Double Displacement":  "mix",
  "Oxidation-Reduction":  "heat",
};

// ─── Initial reactants (what's IN each tube before any trigger) ──────────────
const INITIAL_REACTANTS: Record<string, ReactionResult> = {
  "Combination": {
    visual: "no-reaction",
    liquidColor: "rgba(255,255,255,0.45)", // white-ish CaO + water slurry
    description: "Reactants: CaO (quicklime, white solid) + H₂O. Add the right TRIGGER to start the reaction.",
  },
  "Decomposition": {
    visual: "precipitate",
    precipitateColor: "#f3f4f6", // white CaCO₃ powder at bottom
    liquidColor: "rgba(255,255,255,0.15)", // clear liquid above powder
    description: "Reactant: CaCO₃ (limestone, white powder). Add the right TRIGGER to start the reaction.",
  },
  "Displacement": {
    visual: "no-reaction",
    liquidColor: "rgba(37,99,235,0.55)", // blue CuSO₄ solution
    description: "Reactants: Fe (iron nail) + CuSO₄ (blue solution). Add the right TRIGGER to start the reaction.",
  },
  "Double Displacement": {
    visual: "no-reaction",
    liquidColor: "rgba(219,234,254,0.45)", // clear / faint (two clear salt solutions mixed)
    description: "Reactants: Na₂SO₄ (clear) + BaCl₂ (clear). Add the right TRIGGER to start the reaction.",
  },
  "Oxidation-Reduction": {
    visual: "precipitate",
    precipitateColor: "#1f2937", // black CuO powder at bottom
    liquidColor: "rgba(255,255,255,0.10)", // gas-filled space above
    description: "Reactants: CuO (black powder) + H₂ (gas). Add the right TRIGGER to start the reaction.",
  },
};

// ─── Successful reaction results ─────────────────────────────────────────────
const REACTION_RESULTS: Record<string, ReactionResult> = {
  // CaO + H₂O → Ca(OH)₂  (exothermic, white suspension)
  "Combination": {
    visual: "color-change",
    liquidColor: "rgba(249,250,251,0.92)", // cloudy white Ca(OH)₂ suspension
    description: "CaO + H₂O → Ca(OH)₂ (slaked lime). Cloudy white suspension forms. The tube feels HOT — exothermic!",
  },
  // CaCO₃ →heat→ CaO + CO₂↑
  "Decomposition": {
    visual: "effervescence",
    precipitateColor: "#f3f4f6",
    liquidColor: "rgba(255,255,255,0.20)",
    description: "CaCO₃ →heat→ CaO + CO₂↑. Bubbles of CO₂ gas rise. White CaO residue remains at the bottom.",
  },
  // Fe + CuSO₄ → FeSO₄ + Cu  (blue→green, brown Cu deposit)
  "Displacement": {
    visual: "precipitate",
    precipitateColor: "#7c2d12", // brown Cu deposit
    liquidColor: "rgba(34,197,94,0.55)", // pale green FeSO₄
    description: "Fe + CuSO₄ → FeSO₄ + Cu. Blue solution fades to pale GREEN. Brown Cu metal deposits on the iron nail.",
  },
  // Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl  (white precipitate)
  "Double Displacement": {
    visual: "precipitate",
    precipitateColor: "#f8fafc", // white BaSO₄
    liquidColor: "rgba(219,234,254,0.30)",
    description: "Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl. A heavy WHITE precipitate of BaSO₄ forms immediately.",
  },
  // CuO + H₂ →heat→ Cu + H₂O  (black → red-brown, water droplets)
  "Oxidation-Reduction": {
    visual: "color-change",
    precipitateColor: "#b91c1c", // red-brown Cu
    liquidColor: "rgba(255,255,255,0.10)",
    description: "CuO + H₂ →heat→ Cu + H₂O. Black powder turns RED-BROWN (Cu metal). Tiny water droplets form on the tube walls.",
  },
};

// ─── TestDef ─────────────────────────────────────────────────────────────────

export const reactionTypeDetectiveTest: TestDef = {
  id: "reaction-type-detective",
  name: "Reaction Type Detective",
  category: "Chemical Reactions and Equations",
  emoji: "🔍",
  gradient: "from-orange-400 via-rose-400 to-violet-500",
  desc: "Five mystery reactions — one of each NCERT type. Add the right trigger (Heat, Electricity, Sunlight, or Mix) to make each reaction happen, observe the products, then classify each as Combination, Decomposition, Displacement, Double Displacement, or Oxidation-Reduction.",
  reagents: [
    {
      id: "heat",
      name: "Heat (Bunsen Burner)",
      shortName: "🔥",
      accentColor: "#dc2626",
      liquidColor: "rgba(239,68,68,0.35)",
      ringColor: "ring-red-500",
      bgColor: "bg-red-50",
    },
    {
      id: "electricity",
      name: "Electricity (Electrodes)",
      shortName: "⚡",
      accentColor: "#facc15",
      liquidColor: "rgba(250,204,21,0.35)",
      ringColor: "ring-yellow-400",
      bgColor: "bg-yellow-50",
    },
    {
      id: "sunlight",
      name: "Sunlight",
      shortName: "☀️",
      accentColor: "#f59e0b",
      liquidColor: "rgba(251,191,36,0.35)",
      ringColor: "ring-amber-400",
      bgColor: "bg-amber-50",
    },
    {
      id: "mix",
      name: "Mix / Stir",
      shortName: "🔄",
      accentColor: "#0ea5e9",
      liquidColor: "rgba(14,165,233,0.30)",
      ringColor: "ring-sky-400",
      bgColor: "bg-sky-50",
    },
  ],
  unknownTypes: [
    "Combination",
    "Decomposition",
    "Displacement",
    "Double Displacement",
    "Oxidation-Reduction",
  ],

  // Legacy 2-reagent signature (required by the type, never used at runtime).
  getReaction: (type, r1Added, r2Added) => {
    const added: string[] = [];
    if (r1Added) added.push("heat");
    if (r2Added) added.push("mix");
    return reactionTypeDetectiveTest.getReactionMulti!(type, added);
  },

  // N-reagent reaction function — used by the player.
  // Logic:
  //   1. No triggers added → show initial reactants (the experiment's "view" of the tube).
  //   2. The CORRECT trigger has been added at any point → show the successful reaction
  //      (it "sticks" — later wrong triggers do NOT undo it).
  //   3. Only wrong triggers added → show "no reaction" feedback so the user can try another.
  getReactionMulti: (unknownType: string, addedReagentIds: string[]): ReactionResult => {
    // Case 1: nothing added yet — show reactants
    if (addedReagentIds.length === 0) {
      return INITIAL_REACTANTS[unknownType] ?? {
        visual: "no-reaction",
        liquidColor: "transparent",
        description: "",
      };
    }

    // Case 2: correct trigger has been added → reaction has happened (sticky)
    const correctTrigger = CORRECT_TRIGGER[unknownType];
    if (correctTrigger && addedReagentIds.includes(correctTrigger)) {
      return REACTION_RESULTS[unknownType];
    }

    // Case 3: only wrong triggers added → no reaction yet, encourage retry
    return {
      visual: "no-reaction",
      liquidColor: INITIAL_REACTANTS[unknownType]?.liquidColor ?? "transparent",
      description:
        "No reaction. The reactants are still sitting unchanged. Try a different trigger — does this reaction need heat, electricity, sunlight, or just mixing?",
    };
  },

  introSteps: [
    {
      title: "Five Mystery Reactions",
      desc: "Tubes A, B, C, D, E each contain a different set of reactants — one of each NCERT reaction type. Identify which is which.",
    },
    {
      title: "Add the Right Trigger",
      desc: "Each reaction needs a specific trigger to start: 🔥 Heat, ⚡ Electricity, ☀️ Sunlight, or 🔄 Mix. The wrong trigger does nothing — read the reactants and predict what's needed.",
    },
    {
      title: "Observe the Products",
      desc: "Watch for color changes (blue→green in displacement), gas bubbles (CO₂ in decomposition), precipitates (white BaSO₄ in double displacement), or temperature changes (hot tube in combination).",
    },
    {
      title: "Classify Each Reaction",
      desc: "Based on your observations, label each tube: Combination (A+B→AB), Decomposition (AB→A+B), Displacement (more reactive kicks out less reactive), Double Displacement (ion exchange), or Oxidation-Reduction (redox).",
    },
  ],
  reactionKey: [
    {
      type: "Combination Reaction",
      results: [
        "Pattern: A + B → AB (two or more reactants → one product)",
        "Often exothermic (tube gets hot)",
        "Example: CaO + H₂O → Ca(OH)₂",
      ],
      color: "bg-amber-50",
      textColor: "text-amber-700",
    },
    {
      type: "Decomposition Reaction",
      results: [
        "Pattern: AB → A + B (one reactant → two or more products)",
        "Requires energy input: heat / electricity / sunlight",
        "Example: CaCO₃ →heat→ CaO + CO₂↑",
      ],
      color: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      type: "Displacement Reaction",
      results: [
        "Pattern: A + BC → AC + B (more reactive element displaces less reactive)",
        "Color change + metal deposit",
        "Example: Fe + CuSO₄ → FeSO₄ + Cu",
      ],
      color: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      type: "Double Displacement Reaction",
      results: [
        "Pattern: AB + CD → AD + CB (ion exchange between two compounds)",
        "Usually forms a precipitate, gas, or water",
        "Example: Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl",
      ],
      color: "bg-sky-50",
      textColor: "text-sky-700",
    },
    {
      type: "Oxidation-Reduction (Redox)",
      results: [
        "Pattern: Simultaneous oxidation (loss of e⁻/H, gain of O) + reduction (gain of e⁻/H, loss of O)",
        "Often a color change in a solid",
        "Example: CuO + H₂ → Cu + H₂O",
      ],
      color: "bg-rose-50",
      textColor: "text-rose-700",
    },
  ],
  recap: [
    "Combination reactions are usually exothermic — burning of fuels, slaking of lime (CaO + H₂O), and respiration are all combination reactions that release heat.",
    "Decomposition has three subtypes based on the energy source: Thermal (heat, e.g., CaCO₃ → CaO + CO₂), Electrolytic (electricity, e.g., 2H₂O → 2H₂ + O₂), and Photolytic (sunlight, e.g., 2AgCl → 2Ag + Cl₂). All three are endothermic.",
    "In a displacement reaction, check the reactivity series: a more reactive metal displaces a less reactive one from its salt solution. Iron is more reactive than copper, so Fe kicks Cu out of CuSO₄ — but copper cannot kick iron out of FeSO₄.",
    "Double displacement reactions are common between two ionic salts in solution. The formation of an insoluble precipitate (like white BaSO₄), a gas, or a molecular compound (like water) is what drives the reaction forward.",
    "In a redox reaction, oxidation and reduction happen simultaneously. In CuO + H₂ → Cu + H₂O, copper oxide is reduced to copper (loses oxygen), while hydrogen is oxidized to water (gains oxygen). The substance that gets oxidized is the reducing agent; the one that gets reduced is the oxidizing agent.",
    "Everyday redox examples: corrosion (rusting of iron, 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃) and rancidity (oxidation of fats and oils in food). Antioxidants and nitrogen-flush packaging slow down rancidity.",
  ],
};

export const manifest: ExperimentManifest = {
  id: "reaction-type-detective",
  title: "Reaction Type Detective",
  emoji: "🔍",
  blurb:
    "5 mystery reactions, 4 triggers (🔥⚡☀️🔄). Identify each as Combination, Decomposition, Displacement, Double Displacement, or Redox — covering ALL 5 NCERT Class 10 Ch. 1 reaction types.",
  gradient: "from-orange-400 via-rose-400 to-violet-500",
  durationMin: 12,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, test: reactionTypeDetectiveTest };
export default module;
