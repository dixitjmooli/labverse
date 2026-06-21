"use client";

// ─── Activity 1.3 — Quicklime + Water ────────────────────────────────────────
// Equation: CaO + H₂O → Ca(OH)₂  (exothermic combination reaction)
//
// Scene:
//   Step 1: Add quicklime (CaO) powder to a beaker
//   Step 2: Add water slowly
//   Step 3: Observe vigorous reaction (hissing, steam, heat, white suspension)
//   Step 4: Test with red litmus → turns blue (basic)
//   Step 5: Classify (Combination)

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type Phase = "intro" | "add-cao" | "add-water" | "observe" | "litmus" | "classify" | "results";

const TOTAL_STEPS = 5;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-cao":   { title: "Add Quicklime",        instruction: "Tip a small amount of QUICKLIME (CaO — white powder) into a clean dry beaker." },
  "add-water": { title: "Add Water Slowly",     instruction: "Add water to the quicklime SLOWLY. The reaction is highly exothermic — never add quicklime to a large amount of water at once." },
  "observe":   { title: "Observe the Reaction", instruction: "A vigorous reaction occurs with a hissing sound. Steam may rise. The beaker becomes very hot. A cloudy white suspension of slaked lime [Ca(OH)₂] forms." },
  "litmus":    { title: "Test with Red Litmus", instruction: "Dip a strip of RED litmus paper into the suspension. If it turns BLUE, the product is basic." },
  "classify":  { title: "Classify the Reaction", instruction: "CaO and H₂O combine to form a single product Ca(OH)₂. What type of reaction is this?" },
};

const OPTIONS = ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Combination";
const EQUATION = "CaO + H₂O → Ca(OH)₂";

const RECAP = [
  "Calcium oxide (quicklime, CaO) reacts vigorously with water to form calcium hydroxide (slaked lime, Ca(OH)₂). This is a COMBINATION reaction — two reactants form a single product.",
  "The reaction is highly EXOTHERMIC. So much heat is released that the water can hiss and partially boil on contact. This is why quicklime must be added to water SLOWLY.",
  "Slaked lime [Ca(OH)₂] is only slightly soluble in water, so most of it stays suspended — giving the mixture its cloudy white appearance. The clear liquid above (lime water) is a dilute solution of Ca(OH)₂.",
  "Slaked lime is widely used: in whitewashing walls (slowly reacts with CO₂ in air to form hard shiny CaCO₃), in making cement and mortar, in tanning leather, and to neutralise acidic soils.",
  "Safety: ALWAYS add quicklime TO water, never water TO quicklime. Adding water to a large mass of quicklime can cause explosive boiling and splattering of caustic material.",
];

const SAFETY_NOTES = [
  "Always add quicklime TO water — never the other way around.",
  "Wear safety goggles — the reaction can splatter hot suspension.",
  "The beaker gets very hot. Handle with a cloth or tongs.",
];

export function QuicklimeWaterActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [caoAdded, setCaoAdded] = useState(false);
  const [waterAdded, setWaterAdded] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [steam, setSteam] = useState(false);
  const [hot, setHot] = useState(false);
  const [litmusDipped, setLitmusDipped] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-cao" ? 0 :
    phase === "add-water" ? 1 :
    phase === "observe" ? 2 :
    phase === "litmus" ? 3 :
    phase === "classify" ? 4 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setCaoAdded(false); setWaterAdded(false); setReacting(false);
    setSteam(false); setHot(false); setLitmusDipped(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleCao = useCallback(() => {
    if (phase !== "add-cao" || caoAdded) return;
    setCaoAdded(true);
    sfx.playDrop();
    setObservation("Quicklime (CaO — white powder) added to the beaker.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, caoAdded]);

  const handleWater = useCallback(() => {
    if (phase !== "add-water" || waterAdded) return;
    setWaterAdded(true);
    sfx.playPour();
    setTimeout(() => {
      setReacting(true);
      setSteam(true);
      setHot(true);
      playReactionSound("effervescence");
      setPhase("observe");
      setObservation("🔥 Vigorous reaction! A HISSING SOUND, STEAM rises, the beaker is VERY HOT (exothermic). A cloudy WHITE suspension of slaked lime forms.");
      setObsVariant("warning");
      setTimeout(() => { setSteam(false); setShowContinue(true); }, 3000);
    }, 800);
  }, [phase, waterAdded]);

  const handleLitmus = useCallback(() => {
    if (phase !== "litmus" || litmusDipped) return;
    setLitmusDipped(true);
    sfx.playDrop();
    setTimeout(() => {
      sfx.playSuccess();
      setObservation("🔵 The RED litmus paper turns BLUE! This confirms the product (slaked lime) is BASIC in nature.");
      setObsVariant("success");
      setShowContinue(true);
    }, 800);
  }, [phase, litmusDipped]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-cao") setPhase("add-water");
    else if (phase === "observe") setPhase("litmus");
    else if (phase === "litmus") setPhase("classify");
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
          emoji="🪨"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 1.3: Add water to a small amount of quicklime (CaO) in a beaker. Observe the vigorous exothermic reaction and the formation of slaked lime [Ca(OH)₂]. Test the product with red litmus paper."
          steps={[
            { title: "Add Quicklime", desc: "Take a small amount of quicklime (CaO — white powder) in a clean dry beaker." },
            { title: "Add Water Slowly", desc: "Add water to the quicklime SLOWLY. The reaction is highly exothermic." },
            { title: "Observe", desc: "Watch for hissing sound, steam, the beaker getting hot, and a cloudy white suspension forming." },
            { title: "Test with Litmus", desc: "Dip red litmus paper into the suspension — it turns blue (basic)." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-cao")}
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
      <ActivityHeader emoji="🪨" gradient={manifest.gradient} name={manifest.title} category="Chemical Reactions and Equations" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <QuicklimeScene caoAdded={caoAdded} waterAdded={waterAdded} steam={steam} hot={hot} litmusDipped={litmusDipped} phase={phase} />
        <AnimatePresence mode="wait">
          {observation && (
            <motion.div key={observation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <ObservationBanner text={observation} variant={obsVariant} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3 flex-wrap justify-center">
          {phase === "add-cao" && (
            <ToolButton emoji="⚪" label="Quicklime (CaO)" onClick={handleCao} disabled={caoAdded} highlighted={!caoAdded} />
          )}
          {phase === "add-water" && (
            <ToolButton emoji="💧" label="Add Water" onClick={handleWater} disabled={waterAdded} highlighted={!waterAdded} />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watch the vigorous reaction…</div>
          )}
          {phase === "litmus" && (
            <ToolButton emoji="🔴" label="Red Litmus Paper" onClick={handleLitmus} disabled={litmusDipped} highlighted={!litmusDipped} />
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="What type of reaction is CaO + H₂O → Ca(OH)₂?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function QuicklimeScene({
  caoAdded, waterAdded, steam, hot, litmusDipped, phase,
}: {
  caoAdded: boolean; waterAdded: boolean; steam: boolean; hot: boolean; litmusDipped: boolean; phase: Phase;
}) {
  const liquidColor = waterAdded ? "rgba(248,250,252,0.92)" : "transparent"; // cloudy white Ca(OH)₂

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: hot
        ? "linear-gradient(to bottom, #fee2e2 0%, #fecaca 55%, #d4a574 55%, #b8845e 100%)"
        : "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Beaker (centered at x=200, bottom at y=230) */}
        <g>
          {/* Liquid inside */}
          {waterAdded && (
            <motion.path
              d="M 158 230 L 242 230 L 242 175 L 158 175 Z"
              fill={liquidColor}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              style={{ transformOrigin: "200px 230px" }}
            />
          )}
          {/* Surface */}
          {waterAdded && (
            <motion.ellipse cx="200" cy="175" rx="42" ry="2.5" fill={liquidColor} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
          )}
          {/* Beaker outline */}
          <path d="M 155 230 L 245 230 L 245 145 L 155 145 Z" fill="none" stroke="#475569" strokeWidth="2.5" />
          {/* Pour spout */}
          <path d="M 155 145 Q 150 142 145 145" fill="none" stroke="#475569" strokeWidth="2.5" />
          <path d="M 245 145 Q 250 142 255 145" fill="none" stroke="#475569" strokeWidth="2.5" />
          {/* Glass shine */}
          <line x1="160" y1="225" x2="160" y2="155" stroke="#ffffff" strokeWidth="2" opacity="0.4" />

          {/* CaO powder at bottom */}
          {caoAdded && !waterAdded && (
            <>
              <path d="M 158 230 Q 200 218 242 230 L 242 230 L 158 230 Z" fill="#f8fafc" />
              <circle cx="170" cy="223" r="2" fill="#e2e8f0" />
              <circle cx="185" cy="220" r="2.5" fill="#e2e8f0" />
              <circle cx="200" cy="219" r="2" fill="#e2e8f0" />
              <circle cx="215" cy="220" r="2.5" fill="#e2e8f0" />
              <circle cx="230" cy="223" r="2" fill="#e2e8f0" />
            </>
          )}

          {/* Steam rising */}
          {steam && [0, 1, 2, 3].map((i) => (
            <motion.g key={i}>
              <motion.ellipse
                cx={180 + i * 15}
                cy={170}
                rx="6" ry="3"
                fill="#ffffff" opacity={0.6}
                animate={{ cy: [170, 100, 60], opacity: [0.7, 0.4, 0], rx: [6, 12, 16], ry: [3, 5, 7] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
              />
            </motion.g>
          ))}

          {/* Heat indicator glow at beaker base */}
          {hot && (
            <motion.ellipse
              cx="200" cy="232"
              rx="40" ry="3"
              fill="#dc2626" opacity={0.4}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </g>

        {/* Litmus paper (in litmus phase) — held above the beaker, then dipped into the suspension */}
        {/* Beaker: x=155-245, mouth at y=145, liquid surface at y=175, liquid bottom at y=230 */}
        {/* Litmus paper centered above the beaker at x=200 */}
        {phase === "litmus" && (
          <motion.g
            animate={{ y: litmusDipped ? 55 : 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
          >
            {/* Holder stick (held from above) */}
            <rect x="198" y="80" width="4" height="50" fill="#92400e" rx="1" />
            {/* Litmus strip — starts just above the beaker mouth (y=130-145), not yet in liquid */}
            <rect x="195" y="130" width="10" height="18" fill={litmusDipped ? "#3b82f6" : "#dc2626"} stroke="#1f2937" strokeWidth="0.5" rx="1" />
            {/* Gradual red → blue colour change when dipped */}
            {litmusDipped && (
              <motion.rect
                x="195" y="130" width="10" height="18"
                fill="#3b82f6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            )}
            {/* "Hand" holding the stick (small grip indicator at the top) */}
            <rect x="194" y="74" width="12" height="8" fill="#fde68a" stroke="#92400e" strokeWidth="0.8" rx="2" />
          </motion.g>
        )}

        {/* Labels */}
        {phase === "add-cao" && !caoAdded && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty beaker — add quicklime (CaO)
          </text>
        )}
        {phase === "add-water" && !waterAdded && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Quicklime in beaker — now add water SLOWLY
          </text>
        )}
        {phase === "observe" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="bold" opacity="0.8">
            🔥 Vigorous exothermic reaction — hissing, steam, hot beaker
          </text>
        )}
        {phase === "litmus" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            Red litmus → Blue confirms basic product
          </text>
        )}
      </svg>
    </div>
  );
}
