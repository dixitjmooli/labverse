"use client";

// ─── Activity 2.7 — Non-metal Oxide + Base → Salt + Water ────────────────────
// NCERT Class 10 · Science · Chapter 2 · Activity 2.7
//
// Reaction: 2NaOH + CO₂ → Na₂CO₃ + H₂O  (CO₂ is an acidic oxide; reacts with NaOH)
// Also: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O  (lime water test — confirms CO₂ is acidic)

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type Phase = "intro" | "add-naoh" | "pass-co2" | "observe" | "classify" | "results";

const TOTAL_STEPS = 4;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-naoh":  { title: "Add NaOH Solution",      instruction: "Take some SODIUM HYDROXIDE (NaOH) solution in a test tube. Add a few drops of phenolphthalein — the solution turns PINK (basic)." },
  "pass-co2":  { title: "Pass CO₂ Gas",             instruction: "Pass CARBON DIOXIDE gas through the pink NaOH solution. CO₂ is an ACIDIC OXIDE — it should react with the base." },
  "observe":   { title: "Observe the Reaction",     instruction: "The PINK colour slowly DISAPPEARS as CO₂ reacts with NaOH. The product is SODIUM CARBONATE (Na₂CO₃), which is less basic than NaOH." },
  "classify":  { title: "Conclude",                 instruction: "2NaOH + CO₂ → Na₂CO₃ + H₂O. A non-metal oxide reacts with a base to form a salt + water. What type of reaction?" },
};

const OPTIONS = ["Double Displacement (Neutralisation)", "Combination", "Decomposition", "Displacement", "Oxidation-Reduction"];
const CORRECT = "Double Displacement (Neutralisation)";
const EQUATION = "2NaOH + CO₂ → Na₂CO₃ + H₂O    (acidic oxide + base → salt + water)";

const RECAP = [
  "Non-metal oxides are ACIDIC in nature — they react with bases to produce a SALT + WATER. The general equation: Non-metal Oxide + Base → Salt + Water. This is the mirror of Activity 2.6 (basic oxide + acid → salt + water).",
  "Example: 2NaOH + CO₂ → Na₂CO₃ + H₂O. Carbon dioxide is an acidic oxide; it neutralises sodium hydroxide to form sodium carbonate (washing soda) and water.",
  "Other examples: SO₂ + 2NaOH → Na₂SO₃ + H₂O (sulphur dioxide is acidic). SO₃ + 2NaOH → Na₂SO₄ + H₂O. P₂O₅ + 6NaOH → 2Na₃PO₄ + 3H₂O. All non-metal oxides (CO₂, SO₂, SO₃, NO₂, P₂O₅) are acidic.",
  "The colour change with phenolphthalein is a clever trick: phenolphthalein is PINK in basic solutions (pH > 8.2). NaOH is strongly basic (pH ≈ 13), so the indicator is bright pink. As CO₂ neutralises the NaOH, the pH drops below 8.2 and the pink colour disappears — visual proof of neutralisation.",
  "If you keep bubbling CO₂ through the solution after the pink disappears, the CO₂ reacts further with the Na₂CO₃ to form NaHCO₃ (baking soda): Na₂CO₃ + H₂O + CO₂ → 2NaHCO₃. This is the basis of the Solvay process for manufacturing baking soda industrially.",
  "Environmental application: CO₂ + SO₂ + NO₂ emissions from factories are acidic oxides. They react with atmospheric moisture to form carbonic, sulphuric, and nitric acids — the main components of ACID RAIN. Scrubbing factory exhausts with NaOH/Ca(OH)₂ neutralises these acidic oxides before they escape.",
];

const SAFETY_NOTES = [
  "NaOH is caustic — wear goggles.",
  "CO₂ is not toxic but can displace oxygen in a closed room — ventilate.",
  "Handle phenolphthalein carefully — it stains.",
];

export function NonMetalOxideBaseActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [naohAdded, setNaohAdded] = useState(false);
  const [co2Passing, setCo2Passing] = useState(false);
  const [pinkFading, setPinkFading] = useState(false);
  const [colorless, setColorless] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-naoh" ? 0 :
    phase === "pass-co2" ? 1 :
    phase === "observe" ? 2 :
    phase === "classify" ? 3 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setNaohAdded(false); setCo2Passing(false); setPinkFading(false); setColorless(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleNaoh = useCallback(() => {
    if (phase !== "add-naoh" || naohAdded) return;
    setNaohAdded(true);
    sfx.playPour();
    setTimeout(() => {
      sfx.playSuccess();
      setObservation("🟪 NaOH solution added + a few drops of phenolphthalein. The solution turns bright PINK — confirming NaOH is strongly basic.");
      setObsVariant("success");
      setShowContinue(true);
    }, 800);
  }, [phase, naohAdded]);

  const handleCo2 = useCallback(() => {
    if (phase !== "pass-co2" || co2Passing) return;
    setCo2Passing(true);
    sfx.playPour();
    setPhase("observe");
    setObservation("💨 CO₂ gas is bubbling through the pink NaOH solution. The reaction begins…");
    setObsVariant("info");
    setTimeout(() => {
      setPinkFading(true);
      playReactionSound("color-change");
      setObservation("🟪 → ⚪ The PINK colour is slowly FADING. The NaOH is being neutralised by the acidic CO₂.");
      setObsVariant("success");
    }, 2000);
    setTimeout(() => {
      setColorless(true);
      sfx.playSuccess();
      setObservation("✅ The solution is now COLOURLESS. All the NaOH has reacted with CO₂ to form Na₂CO₃ + H₂O. The reaction is complete.");
      setObsVariant("success");
      setShowContinue(true);
    }, 4500);
  }, [phase, co2Passing]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-naoh") setPhase("pass-co2");
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
          emoji="💨"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 2.7: Pass CO₂ through NaOH solution (with phenolphthalein). The pink colour disappears as CO₂ (an acidic oxide) neutralises the base. Mirror of Activity 2.6."
          steps={[
            { title: "Add NaOH + Phenolphthalein", desc: "NaOH + a few drops of phenolphthalein → solution turns PINK (basic)." },
            { title: "Pass CO₂ Gas", desc: "Bubble CO₂ through the pink solution." },
            { title: "Observe", desc: "Pink colour fades → colourless. NaOH neutralised." },
            { title: "Conclude", desc: "2NaOH + CO₂ → Na₂CO₃ + H₂O. Acidic oxide + base = neutralisation." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-naoh")}
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
      <ActivityHeader emoji="💨" gradient={manifest.gradient} name={manifest.title} category="Acids, Bases and Salts" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <NonMetalOxideBaseScene naohAdded={naohAdded} co2Passing={co2Passing} pinkFading={pinkFading} colorless={colorless} phase={phase} />
        <AnimatePresence mode="wait">
          {observation && (
            <motion.div key={observation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <ObservationBanner text={observation} variant={obsVariant} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3 flex-wrap justify-center">
          {phase === "add-naoh" && (
            <ToolButton emoji="🟪" label="Add NaOH + PhPh" onClick={handleNaoh} disabled={naohAdded} highlighted={!naohAdded} />
          )}
          {phase === "pass-co2" && (
            <ToolButton emoji="💨" label="Pass CO₂ Gas" onClick={handleCo2} disabled={co2Passing} highlighted={!co2Passing} />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watching the pink colour fade…</div>
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="2NaOH + CO₂ → Na₂CO₃ + H₂O. What type of reaction is this?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function NonMetalOxideBaseScene({
  naohAdded, co2Passing, pinkFading, colorless, phase,
}: {
  naohAdded: boolean; co2Passing: boolean; pinkFading: boolean; colorless: boolean; phase: Phase;
}) {
  // Liquid color: transparent → pink → fading pink → colorless
  const liquidColor = !naohAdded ? "transparent" : colorless ? "rgba(255,255,255,0.15)" : pinkFading ? "rgba(236,72,153,0.4)" : "rgba(236,72,153,0.85)";

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Test tube (vertical, x=180-220) */}
        <g>
          {/* Liquid */}
          {naohAdded && (
            <motion.rect
              x="184" y="160" width="32" height="65"
              fill={liquidColor}
              animate={{ fill: liquidColor }}
            />
          )}
          {naohAdded && (
            <motion.ellipse cx="200" cy="160" rx="16" ry="2" fill={liquidColor} animate={{ fill: liquidColor }} />
          )}
          {/* Tube outline */}
          <path d="M 184 130 L 216 130 L 216 220 Q 216 226 210 226 L 190 226 Q 184 226 184 220 Z" fill="rgba(255,255,255,0.1)" stroke="#475569" strokeWidth="2" />
          <rect x="180" y="126" width="40" height="6" fill="none" stroke="#475569" strokeWidth="2" rx="1" />
          <line x1="188" y1="218" x2="188" y2="135" stroke="#ffffff" strokeWidth="1" opacity={colorless ? 0 : 0.4} />
        </g>

        {/* CO₂ delivery tube (enters from above the tube mouth, going down into liquid) */}
        {co2Passing && (
          <g>
            <path d="M 200 80 L 200 175" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            {/* CO₂ label */}
            <text x="200" y="70" textAnchor="middle" fontSize="9" fill="#0ea5e9" fontWeight="bold">CO₂ ↓</text>
            {/* CO₂ particles flowing down the tube */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={200}
                cy={90}
                r={2}
                fill="#7dd3fc"
                opacity={0.8}
                animate={{
                  cy: [90, 175, 215],
                  opacity: [0, 1, 0.8, 0],
                }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
            {/* Bubbles in liquid */}
            {[0, 1, 2, 3].map((i) => (
              <motion.circle
                key={`bubble-${i}`}
                cx={195 + (i * 3)}
                cy={215}
                r={1.5}
                fill="#ffffff"
                opacity={0.8}
                animate={{
                  cy: [215, 165],
                  opacity: [0.8, 0.8, 0],
                }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.25, ease: "easeOut" }}
              />
            ))}
          </g>
        )}

        {/* Top label */}
        {phase === "add-naoh" && !naohAdded && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty test tube — add NaOH + phenolphthalein
          </text>
        )}
        {phase === "pass-co2" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Pink NaOH solution ready — pass CO₂ gas through it
          </text>
        )}
        {phase === "observe" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            {colorless ? "✅ Solution colourless — NaOH neutralised by CO₂" : pinkFading ? "🟪 → ⚪ Pink colour fading…" : "💨 CO₂ bubbling through pink solution…"}
          </text>
        )}
      </svg>
    </div>
  );
}
