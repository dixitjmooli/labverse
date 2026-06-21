"use client";

// ─── Activity 2.1 — Acids are sour, turn blue litmus red ─────────────────────
// NCERT Class 10 · Science · Chapter 2 · Activity 2.1
//
// Scene: Test three mystery solutions (dilute HCl, dilute H₂SO₄, dilute CH₃COOH)
// with blue litmus paper. All three turn the litmus RED — confirming they are acids.
// Also taste note: acids are SOUR (lemon, vinegar).

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type Phase = "intro" | "dip-hcl" | "dip-h2so4" | "dip-ch3cooh" | "classify" | "results";

const TOTAL_STEPS = 4;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "dip-hcl":    { title: "Test Dilute HCl",        instruction: "Dip BLUE litmus paper into dilute hydrochloric acid (HCl). Observe the colour change." },
  "dip-h2so4":  { title: "Test Dilute H₂SO₄",      instruction: "Dip a fresh strip of BLUE litmus paper into dilute sulphuric acid (H₂SO₄). Observe." },
  "dip-ch3cooh":{ title: "Test Vinegar (CH₃COOH)", instruction: "Dip a fresh strip of BLUE litmus paper into vinegar (acetic acid, CH₃COOH). Observe." },
  "classify":   { title: "Conclude",                instruction: "All three solutions turned blue litmus RED. What does this tell you about them?" },
};

const OPTIONS = ["They are all acids", "They are all bases", "They are all neutral salts", "Two are acids and one is a base", "Cannot be determined"];
const CORRECT = "They are all acids";
const EQUATION = "Acid + Blue Litmus → RED  (universal test for acids)";

const RECAP = [
  "Acids are substances that release H⁺ (hydrogen ions) in aqueous solution. The H⁺ ion is what gives acids their characteristic properties — sour taste, turning blue litmus red, reacting with metals to liberate H₂, and reacting with carbonates to liberate CO₂.",
  "All three solutions tested (HCl, H₂SO₄, CH₃COOH) turned blue litmus paper RED, confirming they are acids. This is the universal test for acids — independent of which specific acid it is.",
  "The three acids differ in strength: HCl and H₂SO₄ are STRONG acids (ionise completely in water), while CH₃COOH (acetic acid, vinegar) is a WEAK acid (only partially ionises). But all three release enough H⁺ to turn blue litmus red.",
  "Acids taste SOUR. Common examples: lemon juice (citric acid), vinegar (acetic acid), tamarind (tartaric acid), curd (lactic acid), orange juice (ascorbic acid / vitamin C).",
  "Important: NEVER taste laboratory acids — they can be corrosive. The sour-taste observation applies to FOOD acids in dilute form only. Always use litmus or pH paper to identify a laboratory acid.",
];

const SAFETY_NOTES = [
  "NEVER taste laboratory acids — even dilute ones can be harmful.",
  "Wear safety goggles when handling acids.",
  "If acid spills on skin, rinse immediately with plenty of water.",
];

const ACIDS = [
  { id: "hcl", name: "Dilute HCl", formula: "HCl", color: "rgba(219,234,254,0.6)" },
  { id: "h2so4", name: "Dilute H₂SO₄", formula: "H₂SO₄", color: "rgba(219,234,254,0.5)" },
  { id: "ch3cooh", name: "Vinegar (CH₃COOH)", formula: "CH₃COOH", color: "rgba(254,243,199,0.6)" },
] as const;

export function AcidsSourBlueLitmusActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [dipped, setDipped] = useState<Record<string, boolean>>({ hcl: false, h2so4: false, ch3cooh: false });
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "dip-hcl" ? 0 :
    phase === "dip-h2so4" ? 1 :
    phase === "dip-ch3cooh" ? 2 :
    phase === "classify" ? 3 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setDipped({ hcl: false, h2so4: false, ch3cooh: false });
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleDip = useCallback((acidId: string, acidName: string, acidFormula: string) => {
    if (dipped[acidId]) return;
    setDipped(prev => ({ ...prev, [acidId]: true }));
    sfx.playDrop();
    setTimeout(() => {
      sfx.playSuccess();
      setObservation(`🔵 → 🔴 The BLUE litmus paper turns RED in ${acidName} (${acidFormula}). This confirms ${acidFormula} is an ACID.`);
      setObsVariant("success");
      setShowContinue(true);
    }, 500);
  }, [dipped]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "dip-hcl") setPhase("dip-h2so4");
    else if (phase === "dip-h2so4") setPhase("dip-ch3cooh");
    else if (phase === "dip-ch3cooh") setPhase("classify");
  }, [phase]);

  const handleClassify = useCallback((opt: string) => {
    setSelectedAnswer(opt);
    setTimeout(() => setPhase("results"), 300);
  }, []);

  const correct = selectedAnswer === CORRECT;
  const currentAcidId = phase === "dip-hcl" ? "hcl" : phase === "dip-h2so4" ? "h2so4" : phase === "dip-ch3cooh" ? "ch3cooh" : null;
  const currentAcid = ACIDS.find(a => a.id === currentAcidId);

  if (phase === "intro") {
    return (
      <ActivityShell manifest={manifest}>
        <ActivityIntro
          emoji="🟦"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 2.1: Test three acid solutions (dilute HCl, dilute H₂SO₄, vinegar) with BLUE litmus paper. All three turn the litmus RED — confirming they are acids."
          steps={[
            { title: "Test Dilute HCl", desc: "Dip blue litmus paper in dilute hydrochloric acid." },
            { title: "Test Dilute H₂SO₄", desc: "Dip a fresh strip of blue litmus paper in dilute sulphuric acid." },
            { title: "Test Vinegar (CH₃COOH)", desc: "Dip a fresh strip of blue litmus paper in vinegar." },
            { title: "Conclude", desc: "All three turn blue litmus red → they are all acids." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("dip-hcl")}
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
      <ActivityHeader emoji="🟦" gradient={manifest.gradient} name={manifest.title} category="Acids, Bases and Salts" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <AcidsLitmusScene currentAcid={currentAcid} dipped={dipped[currentAcidId ?? ""] ?? false} phase={phase} />
        <AnimatePresence mode="wait">
          {observation && (
            <motion.div key={observation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <ObservationBanner text={observation} variant={obsVariant} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3 flex-wrap justify-center">
          {currentAcid && (
            <ToolButton emoji="🟦" label={`Dip Blue Litmus in ${currentAcid.formula}`} onClick={() => handleDip(currentAcid.id, currentAcid.name, currentAcid.formula)} disabled={dipped[currentAcid.id]} highlighted={!dipped[currentAcid.id]} />
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="All three solutions turned blue litmus red. What can you conclude?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function AcidsLitmusScene({
  currentAcid, dipped, phase,
}: {
  currentAcid: typeof ACIDS[number] | undefined; dipped: boolean; phase: Phase;
}) {
  // Three test tubes side by side; the current one is highlighted
  // Litmus paper dips into the current tube when "dipped"

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Three test tubes */}
        {ACIDS.map((acid, i) => {
          const x = 90 + i * 110;
          const isCurrent = currentAcid?.id === acid.id;
          const isDipped = dipped && acid.id === currentAcid?.id;
          return (
            <g key={acid.id}>
              {/* Liquid */}
              <rect x={x} y={170} width={30} height={60} fill={acid.color} />
              {/* Liquid surface */}
              <ellipse cx={x + 15} cy={170} rx={15} ry={2} fill={acid.color} />
              {/* Tube outline */}
              <rect x={x - 1} y={140} width={32} height={92} fill="none" stroke="#475569" strokeWidth="2" rx="3" />
              <rect x={x - 4} y={136} width={38} height="6" fill="none" stroke="#475569" strokeWidth="2" rx="1" />
              {/* Glass shine */}
              <line x1={x + 3} y1={225} x2={x + 3} y2={148} stroke="#ffffff" strokeWidth="1" opacity="0.4" />
              {/* Label */}
              <text x={x + 15} y={258} textAnchor="middle" fontSize="8" fill="#1f2937" fontWeight="bold">{acid.formula}</text>

              {/* Highlight ring around current tube */}
              {isCurrent && (
                <motion.rect
                  x={x - 6}
                  y={132}
                  width={42}
                  height={100}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="3,2"
                  rx="4"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}

              {/* Litmus paper (only on the current acid, dipping in) */}
              {isCurrent && (
                <motion.g
                  animate={{ y: isDipped ? 30 : 0 }}
                  transition={{ type: "spring", stiffness: 80, damping: 12 }}
                >
                  {/* Holder stick */}
                  <rect x={x + 13} y={70} width={4} height={50} fill="#92400e" rx="1" />
                  {/* Litmus strip — blue → red when dipped */}
                  <rect x={x + 10} y={118} width={10} height={22} fill={isDipped ? "#dc2626" : "#3b82f6"} stroke="#1f2937" strokeWidth="0.5" rx="1" />
                  {isDipped && (
                    <motion.rect
                      x={x + 10}
                      y={118}
                      width={10}
                      height={22}
                      fill="#dc2626"
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

        {/* Top label */}
        {phase !== "classify" && currentAcid && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Dip BLUE litmus paper into {currentAcid.formula}
          </text>
        )}
        {phase === "classify" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            ✅ All three solutions turned blue litmus RED
          </text>
        )}
      </svg>
    </div>
  );
}
