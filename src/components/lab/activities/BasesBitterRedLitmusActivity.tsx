"use client";

// ─── Activity 2.2 — Bases are bitter, turn red litmus blue, feel soapy ───────
// NCERT Class 10 · Science · Chapter 2 · Activity 2.2
//
// Scene: Test three base solutions (NaOH, KOH, Ca(OH)₂) with RED litmus paper.
// All three turn the litmus BLUE — confirming they are bases.

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type Phase = "intro" | "dip-naoh" | "dip-koh" | "dip-caoh2" | "classify" | "results";

const TOTAL_STEPS = 4;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "dip-naoh":   { title: "Test NaOH Solution",       instruction: "Dip RED litmus paper into sodium hydroxide (NaOH) solution. Observe the colour change." },
  "dip-koh":    { title: "Test KOH Solution",        instruction: "Dip a fresh strip of RED litmus paper into potassium hydroxide (KOH) solution. Observe." },
  "dip-caoh2":  { title: "Test Ca(OH)₂ Solution",   instruction: "Dip a fresh strip of RED litmus paper into calcium hydroxide (limewater, Ca(OH)₂). Observe." },
  "classify":   { title: "Conclude",                  instruction: "All three solutions turned red litmus BLUE. What does this tell you about them?" },
};

const OPTIONS = ["They are all bases", "They are all acids", "They are all neutral salts", "Two are bases and one is an acid", "Cannot be determined"];
const CORRECT = "They are all bases";
const EQUATION = "Base + Red Litmus → BLUE  (universal test for bases)";

const RECAP = [
  "Bases are substances that release OH⁻ (hydroxide ions) in aqueous solution. The OH⁻ ion gives bases their characteristic properties — bitter taste, soapy feel, turning red litmus blue, and reacting with acids to form salts.",
  "All three solutions tested (NaOH, KOH, Ca(OH)₂) turned red litmus paper BLUE, confirming they are bases. This is the universal test for bases — independent of which specific base it is.",
  "The three bases differ in solubility: NaOH and KOH are STRONG, soluble bases (alkalis) that ionise completely. Ca(OH)₂ is sparingly soluble (limewater), but enough OH⁻ dissolves to turn red litmus blue.",
  "Bases taste BITTER and feel SOAPY/SLIPPERY to the touch (they react with the oils on your skin to form soap). Common examples: baking soda (NaHCO₃), soap, household ammonia, milk of magnesia (Mg(OH)₂), antacids.",
  "Important: NEVER taste or touch laboratory bases — strong bases like NaOH and KOH are CAUSTIC and cause severe burns. The bitter/soapy observations apply to dilute household bases only. Always use litmus or pH paper to identify a laboratory base.",
];

const SAFETY_NOTES = [
  "NEVER taste or touch laboratory bases — they are caustic and cause burns.",
  "Wear safety goggles when handling NaOH or KOH.",
  "If base spills on skin, rinse immediately with plenty of water.",
];

const BASES = [
  { id: "naoh", name: "Sodium Hydroxide", formula: "NaOH", color: "rgba(186,230,253,0.5)" },
  { id: "koh", name: "Potassium Hydroxide", formula: "KOH", color: "rgba(186,230,253,0.45)" },
  { id: "caoh2", name: "Limewater", formula: "Ca(OH)₂", color: "rgba(219,234,254,0.7)" },
] as const;

export function BasesBitterRedLitmusActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [dipped, setDipped] = useState<Record<string, boolean>>({ naoh: false, koh: false, caoh2: false });
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "dip-naoh" ? 0 :
    phase === "dip-koh" ? 1 :
    phase === "dip-caoh2" ? 2 :
    phase === "classify" ? 3 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setDipped({ naoh: false, koh: false, caoh2: false });
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleDip = useCallback((baseId: string, baseName: string, baseFormula: string) => {
    if (dipped[baseId]) return;
    setDipped(prev => ({ ...prev, [baseId]: true }));
    sfx.playDrop();
    setTimeout(() => {
      sfx.playSuccess();
      setObservation(`🔴 → 🔵 The RED litmus paper turns BLUE in ${baseName} (${baseFormula}). This confirms ${baseFormula} is a BASE.`);
      setObsVariant("success");
      setShowContinue(true);
    }, 500);
  }, [dipped]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "dip-naoh") setPhase("dip-koh");
    else if (phase === "dip-koh") setPhase("dip-caoh2");
    else if (phase === "dip-caoh2") setPhase("classify");
  }, [phase]);

  const handleClassify = useCallback((opt: string) => {
    setSelectedAnswer(opt);
    setTimeout(() => setPhase("results"), 300);
  }, []);

  const correct = selectedAnswer === CORRECT;
  const currentBaseId = phase === "dip-naoh" ? "naoh" : phase === "dip-koh" ? "koh" : phase === "dip-caoh2" ? "caoh2" : null;
  const currentBase = BASES.find(b => b.id === currentBaseId);

  if (phase === "intro") {
    return (
      <ActivityShell manifest={manifest}>
        <ActivityIntro
          emoji="🟥"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 2.2: Test three base solutions (NaOH, KOH, Ca(OH)₂ limewater) with RED litmus paper. All three turn the litmus BLUE — confirming they are bases."
          steps={[
            { title: "Test NaOH Solution", desc: "Dip red litmus paper in sodium hydroxide." },
            { title: "Test KOH Solution", desc: "Dip a fresh strip of red litmus paper in potassium hydroxide." },
            { title: "Test Limewater Ca(OH)₂", desc: "Dip a fresh strip of red litmus paper in limewater." },
            { title: "Conclude", desc: "All three turn red litmus blue → they are all bases." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("dip-naoh")}
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
      <ActivityHeader emoji="🟥" gradient={manifest.gradient} name={manifest.title} category="Acids, Bases and Salts" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <BasesLitmusScene currentBase={currentBase} dipped={dipped[currentBaseId ?? ""] ?? false} phase={phase} />
        <AnimatePresence mode="wait">
          {observation && (
            <motion.div key={observation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <ObservationBanner text={observation} variant={obsVariant} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3 flex-wrap justify-center">
          {currentBase && (
            <ToolButton emoji="🟥" label={`Dip Red Litmus in ${currentBase.formula}`} onClick={() => handleDip(currentBase.id, currentBase.name, currentBase.formula)} disabled={dipped[currentBase.id]} highlighted={!dipped[currentBase.id]} />
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="All three solutions turned red litmus blue. What can you conclude?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function BasesLitmusScene({
  currentBase, dipped, phase,
}: {
  currentBase: typeof BASES[number] | undefined; dipped: boolean; phase: Phase;
}) {
  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {BASES.map((base, i) => {
          const x = 90 + i * 110;
          const isCurrent = currentBase?.id === base.id;
          const isDipped = dipped && base.id === currentBase?.id;
          return (
            <g key={base.id}>
              <rect x={x} y={170} width={30} height={60} fill={base.color} />
              <ellipse cx={x + 15} cy={170} rx={15} ry={2} fill={base.color} />
              <rect x={x - 1} y={140} width={32} height={92} fill="none" stroke="#475569" strokeWidth="2" rx="3" />
              <rect x={x - 4} y={136} width={38} height="6" fill="none" stroke="#475569" strokeWidth="2" rx="1" />
              <line x1={x + 3} y1={225} x2={x + 3} y2={148} stroke="#ffffff" strokeWidth="1" opacity="0.4" />
              <text x={x + 15} y={258} textAnchor="middle" fontSize="8" fill="#1f2937" fontWeight="bold">{base.formula}</text>

              {isCurrent && (
                <motion.rect
                  x={x - 6} y={132} width={42} height={100}
                  fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,2" rx="4"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}

              {isCurrent && (
                <motion.g
                  animate={{ y: isDipped ? 30 : 0 }}
                  transition={{ type: "spring", stiffness: 80, damping: 12 }}
                >
                  <rect x={x + 13} y={70} width={4} height={50} fill="#92400e" rx="1" />
                  {/* RED → BLUE when dipped */}
                  <rect x={x + 10} y={118} width={10} height={22} fill={isDipped ? "#3b82f6" : "#dc2626"} stroke="#1f2937" strokeWidth="0.5" rx="1" />
                  {isDipped && (
                    <motion.rect
                      x={x + 10} y={118} width={10} height={22}
                      fill="#3b82f6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  )}
                </motion.g>
              )}
            </g>
          );
        })}

        {phase !== "classify" && currentBase && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Dip RED litmus paper into {currentBase.formula}
          </text>
        )}
        {phase === "classify" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            ✅ All three solutions turned red litmus BLUE
          </text>
        )}
      </svg>
    </div>
  );
}
