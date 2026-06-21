"use client";

// ─── Activity 2.9 — Water of Crystallization (CuSO₄·5H₂O) ────────────────────
// NCERT Class 10 · Science · Chapter 2 · Activity 2.9
//
// Reaction: CuSO₄·5H₂O (BLUE) →heat→ CuSO₄ (WHITE) + 5H₂O↑
// Then: CuSO₄ (WHITE) + 5H₂O → CuSO₄·5H₂O (BLUE)  (reversible — add water back)
//
// Concept: Water of crystallization — water molecules chemically bonded inside
// the crystal structure of a salt. Without this water, the salt's colour changes.

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type CrystalState = "blue" | "transitioning" | "white" | "rehydrated";
type Phase = "intro" | "add-crystals" | "heat" | "observe" | "add-water" | "classify" | "results";

const TOTAL_STEPS = 5;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-crystals": { title: "Add Copper Sulphate Crystals", instruction: "Take a small amount of COPPER SULPHATE crystals (CuSO₄·5H₂O — BLUE crystals) in a dry boiling tube." },
  "heat":         { title: "Heat the Crystals",            instruction: "Hold the tube with a clamp and heat gently over a burner. Water of crystallisation is driven off as steam." },
  "observe":      { title: "Observe the Colour Change",    instruction: "The BLUE crystals turn WHITE (anhydrous CuSO₄). Water droplets condense on the cooler parts of the tube." },
  "add-water":    { title: "Rehydrate the White Powder",   instruction: "Add a few drops of water to the white anhydrous CuSO₄. The colour turns back to BLUE — the reaction is REVERSIBLE." },
  "classify":     { title: "Check Your Understanding",        instruction: "When water is added to the white anhydrous CuSO₄ powder, it instantly turns blue again. Why?" },
};

const OPTIONS = ["The powder REHYDRATES — water re-enters the crystal structure, regenerating CuSO₄·5H₂O", "CuSO₄ dissolves in water to make a blue solution", "CuSO₄ oxidises in water to form CuO", "CuSO₄ reacts with oxygen in the water", "CuSO₄ decomposes in water to form Cu and SO₄"];
const CORRECT = "The powder REHYDRATES — water re-enters the crystal structure, regenerating CuSO₄·5H₂O";
const EQUATION = "CuSO₄·5H₂O (BLUE) ⇌ CuSO₄ (WHITE) + 5H₂O";

const RECAP = [
  "Water of crystallisation is water molecules that are chemically bonded inside the crystal structure of a salt. The salt's colour and crystal shape depend on this water — remove it, and the salt changes appearance.",
  "Copper sulphate pentahydrate (CuSO₄·5H₂O) is BLUE. Each Cu²⁺ ion is surrounded by 4 water molecules directly, plus 1 more held by hydrogen bonding — these 5 waters are the 'water of crystallisation'. When heated, this water is driven off as steam, leaving anhydrous CuSO₄ which is WHITE.",
  "The reaction is REVERSIBLE: add a few drops of water to white anhydrous CuSO₄, and it instantly turns back to BLUE — rehydrating to CuSO₄·5H₂O. The colour change is so reliable that anhydrous CuSO₄ is used as a TEST for water (turns blue in the presence of moisture).",
  "Other salts with water of crystallisation: washing soda (Na₂CO₃·10H₂O — white, loses water on exposure to air), gypsum (CaSO₄·2H₂O), Epsom salt (MgSO₄·7H₂O), and alum (KAl(SO₄)₂·12H₂O). Each has its own characteristic number of water molecules.",
  "Salts that lose water of crystallisation on exposure to air are called EFFLORESCENT (e.g., Na₂CO₃·10H₂O). Salts that absorb water from air are HYGROSCOPIC (e.g., anhydrous CaCl₂). Salts that absorb so much water they dissolve in it are DELIQUESCENT (e.g., NaOH, CaCl₂·6H₂O).",
  "Practical applications: anhydrous CuSO₄ is used as a moisture detector in organic solvents and in testing for water. Cobalt(II) chloride (CoCl₂) does the same — blue when anhydrous, pink when hydrated. These 'moisture indicators' are used in weather strips and humidity sensors.",
];

const SAFETY_NOTES = [
  "Hold the tube at an angle and point the mouth AWAY from your face.",
  "Heat GENTLY — strong heating can decompose the salt further (CuSO₄ → CuO + SO₃).",
  "Copper salts are toxic — wash hands after handling.",
];

export function WaterOfCrystallizationActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [crystalState, setCrystalState] = useState<CrystalState>("blue");
  const [crystalsAdded, setCrystalsAdded] = useState(false);
  const [burnerOn, setBurnerOn] = useState(false);
  const [steam, setSteam] = useState(false);
  const [waterDroplets, setWaterDroplets] = useState(false);
  const [waterAdded, setWaterAdded] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-crystals" ? 0 :
    phase === "heat" ? 1 :
    phase === "observe" ? 2 :
    phase === "add-water" ? 3 :
    phase === "classify" ? 4 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setCrystalState("blue"); setCrystalsAdded(false); setBurnerOn(false);
    setSteam(false); setWaterDroplets(false); setWaterAdded(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleCrystals = useCallback(() => {
    if (phase !== "add-crystals" || crystalsAdded) return;
    setCrystalsAdded(true);
    sfx.playDrop();
    setObservation("BLUE crystals of copper sulphate (CuSO₄·5H₂O) added to the dry boiling tube.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, crystalsAdded]);

  const handleHeat = useCallback(() => {
    if (phase !== "heat" || burnerOn) return;
    setBurnerOn(true);
    sfx.playPour();
    setTimeout(() => {
      setSteam(true);
      setCrystalState("transitioning");
      playReactionSound("color-change");
      setObservation("💨 Steam is rising from the crystals — water of crystallisation is being driven off.");
      setObsVariant("info");
    }, 1500);
    setTimeout(() => {
      setCrystalState("white");
      setWaterDroplets(true);
      setSteam(false);
      sfx.playSuccess();
      setPhase("observe");
      setObservation("✅ The BLUE crystals have turned WHITE (anhydrous CuSO₄). Tiny WATER DROPLETS condense on the cooler walls — that's the lost water of crystallisation.");
      setObsVariant("success");
      setShowContinue(true);
    }, 4000);
  }, [phase, burnerOn]);

  const handleWater = useCallback(() => {
    if (phase !== "add-water" || waterAdded) return;
    setWaterAdded(true);
    sfx.playPour();
    setTimeout(() => {
      setCrystalState("rehydrated");
      playReactionSound("color-change");
      sfx.playSuccess();
      setObservation("🟦 The WHITE powder instantly turns back to BLUE! Adding water to anhydrous CuSO₄ rehydrates it back to CuSO₄·5H₂O — the reaction is REVERSIBLE.");
      setObsVariant("success");
      setShowContinue(true);
    }, 800);
  }, [phase, waterAdded]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-crystals") setPhase("heat");
    else if (phase === "observe") setPhase("add-water");
    else if (phase === "add-water") setPhase("classify");
  }, [phase]);

  const handleClassify = useCallback((opt: string) => {
    setSelectedAnswer(opt);
    setTimeout(() => setPhase("results"), 300);
  }, []);

  const correct = selectedAnswer === CORRECT;

  if (phase === "intro") {
    return (
      <ActivityShell manifest={manifest}>
        <ActivityIntro
          emoji="💧"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 2.9: Heat blue copper sulphate crystals (CuSO₄·5H₂O). They turn white as water of crystallisation is driven off. Add water back — they turn blue again. The reaction is reversible."
          steps={[
            { title: "Add CuSO₄·5H₂O Crystals", desc: "Blue crystals in a dry boiling tube." },
            { title: "Heat Gently", desc: "Water of crystallisation is driven off as steam." },
            { title: "Observe", desc: "Blue → white (anhydrous CuSO₄); water droplets on cooler walls." },
            { title: "Add Water Back", desc: "White powder → blue again (rehydration)." },
            { title: "Conclude", desc: "CuSO₄·5H₂O ⇌ CuSO₄ + 5H₂O — reversible decomposition." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-crystals")}
        />
      </ActivityShell>
    );
  }

  if (phase === "results") {
    return (
      <ActivityShell manifest={manifest}>
        <ActivityResults
          correct={correct}
          selectedAnswer={selectedAnswer ?? ""}
          correctAnswer={CORRECT}
          equation={EQUATION}
          recap={RECAP}
          gradient={manifest.gradient}
          onReset={reset}
        />
      </ActivityShell>
    );
  }

  const stepInfo = STEPS[phase as Exclude<Phase, "intro" | "results">];

  return (
    <ActivityShell manifest={manifest}>
      <ActivityHeader emoji="💧" gradient={manifest.gradient} name={manifest.title} category="Acids, Bases and Salts" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <WaterCrystallizationScene
          crystalState={crystalState}
          crystalsAdded={crystalsAdded}
          burnerOn={burnerOn}
          steam={steam}
          waterDroplets={waterDroplets}
          waterAdded={waterAdded}
          phase={phase}
        />
        <AnimatePresence mode="wait">
          {observation && (
            <motion.div key={observation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <ObservationBanner text={observation} variant={obsVariant} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3 flex-wrap justify-center">
          {phase === "add-crystals" && (
            <ToolButton emoji="🟦" label="Add CuSO₄·5H₂O Crystals" onClick={handleCrystals} disabled={crystalsAdded} highlighted={!crystalsAdded} />
          )}
          {phase === "heat" && (
            <ToolButton emoji="🔥" label="Ignite Burner" onClick={handleHeat} disabled={burnerOn} highlighted={!burnerOn} />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Observing colour change and steam…</div>
          )}
          {phase === "add-water" && (
            <ToolButton emoji="💧" label="Add Water Drops" onClick={handleWater} disabled={waterAdded} highlighted={!waterAdded} />
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify title="Check Your Understanding" question="When water is added to the white anhydrous CuSO₄ powder, it instantly turns blue again. Why?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function WaterCrystallizationScene({
  crystalState, crystalsAdded, burnerOn, steam, waterDroplets, waterAdded, phase,
}: {
  crystalState: CrystalState; crystalsAdded: boolean; burnerOn: boolean;
  steam: boolean; waterDroplets: boolean; waterAdded: boolean; phase: Phase;
}) {
  const crystalColor =
    crystalState === "blue" ? "#3b82f6" :
    crystalState === "transitioning" ? "#94a3b8" :
    crystalState === "white" ? "#f8fafc" :
    "#3b82f6"; // rehydrated = blue again

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Retort stand (left) */}
        <rect x="50" y="100" width="6" height="140" fill="#475569" rx="1" />
        <rect x="30" y="238" width="50" height="6" fill="#1f2937" rx="1" />
        <rect x="55" y="158" width="125" height="6" fill="#475569" rx="1" />
        <rect x="178" y="150" width="14" height="22" fill="#1f2937" rx="2" />
        <rect x="178" y="150" width="14" height="3" fill="#374151" />
        <rect x="178" y="169" width="14" height="3" fill="#374151" />
        <circle cx="185" cy="146" r="3" fill="#6b7280" stroke="#1f2937" strokeWidth="0.5" />

        {/* Boiling tube (vertical, centered above the burner at x=200) */}
        <g>
          <path
            d="M 185 110 L 215 110 L 215 215 Q 215 222 208 222 L 192 222 Q 185 222 185 215 Z"
            fill="rgba(255,255,255,0.15)"
            stroke="#475569"
            strokeWidth="2"
          />
          <rect x="182" y="106" width="36" height="6" fill="none" stroke="#475569" strokeWidth="2" rx="1" />
          <line x1="189" y1="215" x2="189" y2="120" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />

          {/* Crystals at bottom of tube */}
          {crystalsAdded && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x="186" y="205" width="28" height="14" fill={crystalColor} stroke="#1f2937" strokeWidth="0.4" />
              {/* Crystal texture dots */}
              {[192, 200, 208].map((x) => (
                <circle key={x} cx={x} cy={210} r="1.5" fill={crystalState === "white" ? "#cbd5e1" : "#1e40af"} opacity={0.7} />
              ))}
            </motion.g>
          )}

          {/* Water droplets on cooler (upper) wall */}
          {waterDroplets && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <circle cx="190" cy="135" r="1.5" fill="rgba(219,234,254,0.9)" />
              <circle cx="200" cy="135" r="1.8" fill="rgba(219,234,254,0.9)" />
              <circle cx="210" cy="135" r="1.5" fill="rgba(219,234,254,0.9)" />
              <circle cx="195" cy="148" r="1.5" fill="rgba(219,234,254,0.9)" />
              <circle cx="205" cy="148" r="1.8" fill="rgba(219,234,254,0.9)" />
            </motion.g>
          )}

          {/* Water drop being added (when in add-water phase) */}
          {phase === "add-water" && !waterAdded && (
            <motion.g
              animate={{ y: [0, 30, 30, 0], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ellipse cx="200" cy="90" rx="3" ry="4" fill="rgba(219,234,254,0.9)" />
            </motion.g>
          )}
        </g>

        {/* Bunsen burner */}
        <ellipse cx="200" cy="240" rx="22" ry="4" fill="#1f2937" />
        <rect x="190" y="225" width="20" height="18" fill="#374151" rx="2" />
        <rect x="196" y="180" width="8" height="50" fill="#4b5563" rx="1" />
        <rect x="193" y="172" width="14" height="10" fill="#1f2937" rx="1" />

        {/* Burner flame */}
        {burnerOn && (
          <motion.g initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} style={{ transformOrigin: "200px 175px" }}>
            <motion.path d="M 200 175 Q 190 145 195 115 Q 200 100 205 115 Q 210 145 200 175 Z" fill="url(#flameOuter)" animate={{ d: ["M 200 175 Q 190 145 195 115 Q 200 100 205 115 Q 210 145 200 175 Z", "M 200 175 Q 188 145 194 110 Q 200 95 206 110 Q 212 145 200 175 Z", "M 200 175 Q 190 145 195 115 Q 200 100 205 115 Q 210 145 200 175 Z"], transition: { duration: 0.4, repeat: Infinity } }} />
            <path d="M 200 175 Q 196 160 198 140 Q 200 132 202 140 Q 204 160 200 175 Z" fill="url(#flameInner)" />
          </motion.g>
        )}

        {/* Steam rising from tube mouth */}
        {steam && [0, 1, 2, 3].map((i) => (
          <motion.ellipse
            key={i}
            cx={195 + i * 3}
            cy={100}
            rx="5" ry="3"
            fill="#ffffff" opacity={0.6}
            animate={{
              cy: [100, 60, 20],
              opacity: [0.7, 0.4, 0],
              rx: [5, 10, 14],
              ry: [3, 5, 7],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        {/* Top labels */}
        {phase === "add-crystals" && !crystalsAdded && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty boiling tube — add blue CuSO₄·5H₂O crystals
          </text>
        )}
        {phase === "heat" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Blue crystals in tube — heat gently to drive off water
          </text>
        )}
        {phase === "observe" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            {crystalState === "white" ? "✅ Blue → White + water droplets" : "💨 Steam rising — water escaping…"}
          </text>
        )}
        {phase === "add-water" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.8">
            {waterAdded ? "✅ White → Blue (rehydrated!)" : "Add water drops to the white powder"}
          </text>
        )}

        <defs>
          <linearGradient id="flameOuter" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="flameInner" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
