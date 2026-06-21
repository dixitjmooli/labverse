"use client";

// ─── Activity 1.10 — CuO + H₂ ────────────────────────────────────────────────
// Equation: CuO + H₂ →heat→ Cu + H₂O (reduction of CuO, oxidation of H₂ — REDOX)
//
// Scene:
//   Step 1: Add CuO (BLACK powder) to a boiling tube
//   Step 2: Pass H₂ gas over the powder (delivery tube from the side)
//   Step 3: Heat the tube
//   Step 4: Observe BLACK → RED-BROWN (Cu metal) + water droplets on cooler walls

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type PowderState = "black" | "transitioning" | "red-brown";
type Phase = "intro" | "add-cuo" | "pass-h2" | "heat" | "observe" | "classify" | "results";

const TOTAL_STEPS = 5;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-cuo": { title: "Add Copper Oxide",   instruction: "Place a small amount of COPPER OXIDE (CuO — BLACK powder) in a boiling tube." },
  "pass-h2": { title: "Pass Hydrogen Gas",  instruction: "Set up a steady flow of HYDROGEN GAS (H₂) over the powder using a delivery tube. Flush the tube first to remove air (H₂ + air mixtures are explosive)." },
  "heat":    { title: "Heat the Tube",      instruction: "Once H₂ is flowing freely, heat the CuO with a burner. Watch for two changes happening simultaneously." },
  "observe": { title: "Observe the Reaction", instruction: "The BLACK powder turns RED-BROWN (copper metal forms). Tiny WATER DROPLETS condense on the cooler walls of the tube." },
  "classify":{ title: "Classify the Reaction", instruction: "CuO loses oxygen (is reduced). H₂ gains oxygen (is oxidised). Oxidation + reduction together = ?" },
};

const OPTIONS = ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Oxidation-Reduction";
const EQUATION = "CuO + H₂ → Cu + H₂O";

const RECAP = [
  "When hydrogen is passed over heated copper oxide, the CuO loses oxygen and is reduced to copper metal. The hydrogen gains that oxygen and is oxidised to water. Reduction and oxidation happen simultaneously — that is the defining feature of a REDOX reaction.",
  "CuO is the OXIDISING AGENT (it gives oxygen to H₂ and gets reduced itself). H₂ is the REDUCING AGENT (it takes oxygen from CuO and gets oxidised itself). The oxidising agent is always reduced; the reducing agent is always oxidised.",
  "This reaction is also a DISPLACEMENT reaction in a broader sense — hydrogen displaces copper from its oxide. The same pattern (metal oxide + reducing agent → metal) is used industrially to extract metals from their ores, e.g., Fe₂O₃ + 3CO → 2Fe + 3CO₂ in a blast furnace.",
  "The water droplets on the cooler part of the tube are the giveaway that water is one of the products. If you collected and tested them, they would turn white anhydrous CuSO₄ blue — the standard test for water.",
  "Safety: hydrogen + air mixtures are explosive. Always flush the tube with H₂ for a few seconds BEFORE lighting the burner, and never light the H₂ itself as it exits the tube.",
];

const SAFETY_NOTES = [
  "⚠️ Hydrogen + air mixtures are EXPLOSIVE. Flush the tube with H₂ before lighting the burner.",
  "Never light the H₂ gas itself as it exits the tube.",
  "Use a flame arrestor and perform in a well-ventilated lab.",
];

export function CopperOxideHydrogenActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [powderState, setPowderState] = useState<PowderState>("black");
  const [cuoAdded, setCuoAdded] = useState(false);
  const [h2Flowing, setH2Flowing] = useState(false);
  const [burnerOn, setBurnerOn] = useState(false);
  const [waterDroplets, setWaterDroplets] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-cuo" ? 0 :
    phase === "pass-h2" ? 1 :
    phase === "heat" ? 2 :
    phase === "observe" ? 3 :
    phase === "classify" ? 4 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setPowderState("black"); setCuoAdded(false); setH2Flowing(false);
    setBurnerOn(false); setWaterDroplets(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleCuo = useCallback(() => {
    if (phase !== "add-cuo" || cuoAdded) return;
    setCuoAdded(true);
    sfx.playDrop();
    setObservation("BLACK powder of copper oxide (CuO) added to the boiling tube.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, cuoAdded]);

  const handleH2 = useCallback(() => {
    if (phase !== "pass-h2" || h2Flowing) return;
    setH2Flowing(true);
    sfx.playPour();
    setObservation("💨 H₂ gas is now flowing steadily over the CuO powder. The tube has been flushed — safe to heat next.");
    setObsVariant("info");
    setShowContinue(true);
  }, [phase, h2Flowing]);

  const handleBurner = useCallback(() => {
    if (phase !== "heat" || burnerOn) return;
    setBurnerOn(true);
    sfx.playPour();
    setPhase("observe");
    setObservation("🔥 The burner is lit under the boiling tube. Watch the black powder and the cooler walls of the tube…");
    setObsVariant("info");
    // After ~2s, the powder transitions and water droplets form
    setTimeout(() => {
      setPowderState("transitioning");
      playReactionSound("color-change");
      setObservation("Stage 1: The BLACK powder is starting to turn RED-BROWN. Copper metal is forming.");
      setObsVariant("info");
    }, 2000);
    // After ~4s, fully reduced + water droplets visible
    setTimeout(() => {
      setPowderState("red-brown");
      setWaterDroplets(true);
      sfx.playSuccess();
      setObservation("✅ Stage 2: The powder is now RED-BROWN (copper metal). Tiny WATER DROPLETS condense on the cooler walls of the tube (H₂ → H₂O).");
      setObsVariant("success");
      setShowContinue(true);
    }, 4500);
  }, [phase, burnerOn]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-cuo") setPhase("pass-h2");
    else if (phase === "pass-h2") setPhase("heat");
    else if (phase === "observe") setPhase("classify");
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
          emoji="⚫"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 1.10: Pass hydrogen gas over heated copper oxide (CuO). Observe the colour change (black → red-brown) and the formation of water droplets — a redox reaction."
          steps={[
            { title: "Add Copper Oxide", desc: "Place black CuO powder in a boiling tube." },
            { title: "Pass Hydrogen Gas", desc: "Set up a steady H₂ flow over the powder. Flush out air first." },
            { title: "Heat the Tube", desc: "Once H₂ is flowing, heat the CuO with a burner." },
            { title: "Observe", desc: "Black powder → red-brown Cu; water droplets form on the cooler walls." },
            { title: "Classify", desc: "CuO is reduced; H₂ is oxidised. Oxidation + reduction = redox." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-cuo")}
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
      <ActivityHeader emoji="⚫" gradient={manifest.gradient} name={manifest.title} category="Chemical Reactions and Equations" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <CopperOxideHydrogenScene
          powderState={powderState}
          cuoAdded={cuoAdded}
          h2Flowing={h2Flowing}
          burnerOn={burnerOn}
          waterDroplets={waterDroplets}
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
          {phase === "add-cuo" && (
            <ToolButton emoji="⚫" label="CuO Powder" onClick={handleCuo} disabled={cuoAdded} highlighted={!cuoAdded} />
          )}
          {phase === "pass-h2" && (
            <ToolButton emoji="💨" label="Pass H₂ Gas" onClick={handleH2} disabled={h2Flowing} highlighted={!h2Flowing} />
          )}
          {phase === "heat" && (
            <ToolButton emoji="🔥" label="Ignite Burner" onClick={handleBurner} disabled={burnerOn} highlighted={!burnerOn} />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watching the reduction of CuO…</div>
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="What type of reaction is CuO + H₂ → Cu + H₂O?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function CopperOxideHydrogenScene({
  powderState, cuoAdded, h2Flowing, burnerOn, waterDroplets, phase,
}: {
  powderState: PowderState; cuoAdded: boolean; h2Flowing: boolean; burnerOn: boolean; waterDroplets: boolean; phase: Phase;
}) {
  const powderColor =
    powderState === "black" ? "#111827" :
    powderState === "transitioning" ? "#7f1d1d" :
    "#b91c1c"; // red-brown Cu

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Horizontal boiling tube (mouth right, where H₂ delivery enters) */}
        <g>
          {/* Tube body (horizontal) */}
          <rect x="120" y="180" width="140" height="30" fill="rgba(255,255,255,0.15)" stroke="#475569" strokeWidth="2" rx="3" />
          {/* Closed left end (rounded) */}
          <path d="M 120 180 Q 113 195 120 210 Z" fill="rgba(255,255,255,0.15)" stroke="#475569" strokeWidth="2" />
          {/* Open right end (mouth) */}
          <rect x="258" y="176" width="6" height="38" fill="none" stroke="#475569" strokeWidth="2" rx="1" />

          {/* Powder at the bottom of the tube */}
          {cuoAdded && (
            <motion.rect
              x="130"
              y="200"
              width="120"
              height="8"
              fill={powderColor}
              stroke="#1f2937"
              strokeWidth="0.4"
              animate={{ fill: powderColor }}
            />
          )}

          {/* Water droplets on cooler (upper) wall of the tube */}
          {waterDroplets && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <circle cx="140" cy="184" r="1.5" fill="rgba(219,234,254,0.9)" />
              <circle cx="155" cy="184" r="1.8" fill="rgba(219,234,254,0.9)" />
              <circle cx="170" cy="184" r="1.5" fill="rgba(219,234,254,0.9)" />
              <circle cx="185" cy="184" r="2" fill="rgba(219,234,254,0.9)" />
              <circle cx="200" cy="184" r="1.5" fill="rgba(219,234,254,0.9)" />
              <circle cx="215" cy="184" r="1.8" fill="rgba(219,234,254,0.9)" />
              <circle cx="230" cy="184" r="1.5" fill="rgba(219,234,254,0.9)" />
            </motion.g>
          )}

          {/* Glass shine */}
          <line x1="125" y1="183" x2="255" y2="183" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
        </g>

        {/* H₂ delivery tube (enters from the right) */}
        {h2Flowing && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Curved delivery tube */}
            <path d="M 380 230 Q 320 230 290 215 L 290 195" fill="none" stroke="#475569" strokeWidth="2.5" />
            {/* H₂ label */}
            <text x="375" y="225" textAnchor="middle" fontSize="10" fill="#0ea5e9" fontWeight="bold">H₂</text>
            {/* H₂ gas particles flowing in */}
            {[0, 1, 2, 3].map((i) => (
              <motion.circle
                key={i}
                cx="370"
                cy="230"
                r="1.5"
                fill="#7dd3fc"
                animate={{
                  cx: [370, 320, 280, 220],
                  cy: [230, 220, 200, 195],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </motion.g>
        )}

        {/* Burner (below the tube, at x=190) */}
        <g>
          <ellipse cx="190" cy="240" rx="22" ry="4" fill="#1f2937" />
          <rect x="180" y="225" width="20" height="18" fill="#374151" rx="2" />
          <rect x="186" y="215" width="8" height="14" fill="#4b5563" rx="1" />
          {/* Burner tip touching tube bottom */}
          <rect x="183" y="210" width="14" height="6" fill="#1f2937" rx="1" />
        </g>

        {/* Burner flame */}
        {burnerOn && (
          <motion.g initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} style={{ transformOrigin: "190px 213px" }}>
            <motion.path d="M 190 213 Q 184 200 187 188 Q 190 180 193 188 Q 196 200 190 213 Z" fill="url(#flameOuter)" animate={{ d: ["M 190 213 Q 184 200 187 188 Q 190 180 193 188 Q 196 200 190 213 Z", "M 190 213 Q 182 200 186 185 Q 190 178 194 185 Q 198 200 190 213 Z", "M 190 213 Q 184 200 187 188 Q 190 180 193 188 Q 196 200 190 213 Z"], transition: { duration: 0.4, repeat: Infinity } }} />
            <path d="M 190 213 Q 188 205 189 195 Q 190 190 191 195 Q 192 205 190 213 Z" fill="url(#flameInner)" />
          </motion.g>
        )}

        {/* Labels */}
        {phase === "add-cuo" && !cuoAdded && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty boiling tube (horizontal) — add black CuO powder
          </text>
        )}
        {phase === "pass-h2" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Black CuO powder in tube — pass H₂ gas over it
          </text>
        )}
        {phase === "heat" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            H₂ flowing over CuO — ignite burner to start reduction
          </text>
        )}
        {phase === "observe" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            {powderState === "black" ? "Watching…" : powderState === "transitioning" ? "Stage 1: Black → Red-brown (Cu forming)" : "Stage 2: Red-brown Cu + water droplets on walls"}
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
