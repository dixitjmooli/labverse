"use client";

// ─── Activity 2.6 — Metal Oxide + Acid → Salt + Water ────────────────────────
// NCERT Class 10 · Science · Chapter 2 · Activity 2.6
//
// Reaction: CuO + 2HCl → CuCl₂ + H₂O  (black copper oxide dissolves in HCl → blue-green copper chloride solution)

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type Phase = "intro" | "add-cuo" | "add-hcl" | "observe" | "classify" | "results";

const TOTAL_STEPS = 4;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-cuo": { title: "Add Copper Oxide",    instruction: "Take a small amount of COPPER OXIDE (CuO — BLACK powder) in a beaker. CuO is a BASIC OXIDE." },
  "add-hcl": { title: "Add Dilute HCl",      instruction: "Slowly add dilute HCl to the beaker while stirring. The black powder reacts with the acid." },
  "observe": { title: "Observe the Reaction", instruction: "The BLACK powder DISSOLVES, and the solution turns BLUE-GREEN (copper(II) chloride, CuCl₂). Water is also formed." },
  "classify":{ title: "Check Your Understanding",            instruction: "CuO reacts with HCl to form a salt + water. What does this tell you about copper oxide?" },
};

const OPTIONS = ["CuO is a BASIC OXIDE (reacts with acids)", "CuO is an ACIDIC OXIDE (reacts with bases)", "CuO is a NEUTRAL OXIDE", "CuO is an AMPHOTERIC OXIDE", "CuO is a PEROXIDE"];
const CORRECT = "CuO is a BASIC OXIDE (reacts with acids)";
const EQUATION = "CuO + 2HCl → CuCl₂ + H₂O    (basic oxide + acid → salt + water)";

const RECAP = [
  "Metal oxides are BASIC in nature — they react with acids to produce a SALT + WATER. This is a NEUTRALISATION reaction (a special type of double displacement). The general equation: Metal Oxide + Acid → Salt + Water.",
  "Example: CuO (black copper oxide) + 2HCl → CuCl₂ (blue-green copper chloride) + H₂O. The black powder dissolves completely, leaving a clear blue-green solution of the salt.",
  "All metal oxides are basic: Na₂O, CaO, MgO, Fe₂O₃, CuO, etc. Some (like Na₂O, CaO, K₂O) are soluble in water and form alkalis (NaOH, Ca(OH)₂, KOH). Others (like CuO, Fe₂O₃) are insoluble in water but still react with acids to form salts.",
  "The colour change is often the giveaway. CuO is BLACK; the salt CuCl₂ (in solution) is BLUE-GREEN. Fe₂O₃ is RED-BROWN; the salt FeCl₃ is YELLOW-BROWN. These colour changes confirm a new compound has formed.",
  "Compare with Activity 2.7 (next): non-metal oxides (like CO₂, SO₂) are ACIDIC and react with BASES to form salt + water. Together, these two activities show that 'acidic oxides' pair with bases, and 'basic oxides' pair with acids.",
  "Practical application: this reaction is used to recover copper from waste circuit boards (dissolve in acid → electrolyse the CuCl₂ solution). It is also the basis of metal pickling (removing oxide scale from steel using HCl).",
];

const SAFETY_NOTES = [
  "Wear safety goggles when handling acids.",
  "Copper salts are toxic — avoid skin contact and do not ingest.",
  "Stir gently to avoid splashing.",
];

export function MetalOxideAcidActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [cuoAdded, setCuoAdded] = useState(false);
  const [hclAdded, setHclAdded] = useState(false);
  const [stirring, setStirring] = useState(false);
  const [dissolved, setDissolved] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-cuo" ? 0 :
    phase === "add-hcl" ? 1 :
    phase === "observe" ? 2 :
    phase === "classify" ? 3 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setCuoAdded(false); setHclAdded(false); setStirring(false); setDissolved(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleCuo = useCallback(() => {
    if (phase !== "add-cuo" || cuoAdded) return;
    setCuoAdded(true);
    sfx.playDrop();
    setObservation("BLACK copper oxide (CuO) powder added to the beaker.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, cuoAdded]);

  const handleHcl = useCallback(() => {
    if (phase !== "add-hcl" || hclAdded) return;
    setHclAdded(true);
    sfx.playPour();
    setPhase("observe");
    setObservation("Pouring dilute HCl onto the CuO. Stirring begins — the black powder is starting to dissolve.");
    setObsVariant("info");
    setTimeout(() => {
      setStirring(true);
      playReactionSound("color-change");
      setObservation("🟢 The BLACK powder is DISSOLVING. The solution is turning BLUE-GREEN (copper chloride, CuCl₂, forming).");
      setObsVariant("success");
    }, 1500);
    setTimeout(() => {
      setDissolved(true);
      sfx.playSuccess();
      setObservation("✅ All the CuO has dissolved. The solution is uniformly BLUE-GREEN CuCl₂ in water. The reaction is complete: CuO + 2HCl → CuCl₂ + H₂O.");
      setObsVariant("success");
      setShowContinue(true);
    }, 4000);
  }, [phase, hclAdded]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-cuo") setPhase("add-hcl");
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
          desc="NCERT Activity 2.6: Add dilute HCl to black copper oxide (CuO). The black powder dissolves and the solution turns blue-green — copper chloride (CuCl₂) has formed. Metal oxide + acid → salt + water."
          steps={[
            { title: "Add Copper Oxide", desc: "Put black CuO powder in a beaker." },
            { title: "Add Dilute HCl", desc: "Pour HCl onto the CuO while stirring." },
            { title: "Observe", desc: "Black powder dissolves; solution turns blue-green (CuCl₂)." },
            { title: "Conclude", desc: "CuO + 2HCl → CuCl₂ + H₂O. Neutralisation." },
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
      <ActivityHeader emoji="⚫" gradient={manifest.gradient} name={manifest.title} category="Acids, Bases and Salts" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <MetalOxideAcidScene cuoAdded={cuoAdded} hclAdded={hclAdded} stirring={stirring} dissolved={dissolved} phase={phase} />
        <AnimatePresence mode="wait">
          {observation && (
            <motion.div key={observation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <ObservationBanner text={observation} variant={obsVariant} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3 flex-wrap justify-center">
          {phase === "add-cuo" && (
            <ToolButton emoji="⚫" label="Add CuO Powder" onClick={handleCuo} disabled={cuoAdded} highlighted={!cuoAdded} />
          )}
          {phase === "add-hcl" && (
            <ToolButton emoji="🧴" label="Add Dilute HCl + Stir" onClick={handleHcl} disabled={hclAdded} highlighted={!hclAdded} />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watching CuO dissolve in HCl…</div>
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify title="Check Your Understanding" question="CuO reacts with HCl to form a salt + water. What does this tell you about copper oxide?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function MetalOxideAcidScene({
  cuoAdded, hclAdded, stirring, dissolved, phase,
}: {
  cuoAdded: boolean; hclAdded: boolean; stirring: boolean; dissolved: boolean; phase: Phase;
}) {
  // Beaker centered at x=200, bottom at y=230, mouth at y=140
  // Liquid: clear before HCl, then blue-green after dissolution
  const liquidColor = dissolved ? "rgba(20,184,166,0.7)" : hclAdded ? "rgba(34,197,94,0.2)" : "transparent";

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Beaker */}
        <g>
          {/* Liquid */}
          {hclAdded && (
            <motion.path
              d="M 155 230 L 245 230 L 245 160 L 155 160 Z"
              fill={liquidColor}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1, fill: liquidColor }}
              style={{ transformOrigin: "200px 230px" }}
            />
          )}
          {hclAdded && (
            <motion.ellipse cx="200" cy="160" rx="45" ry="3" fill={liquidColor} animate={{ fill: liquidColor }} />
          )}
          {/* Beaker outline */}
          <path d="M 150 230 L 250 230 L 250 140 L 150 140 Z" fill="none" stroke="#475569" strokeWidth="2.5" />
          <path d="M 150 140 Q 145 137 140 140" fill="none" stroke="#475569" strokeWidth="2.5" />
          <path d="M 250 140 Q 255 137 260 140" fill="none" stroke="#475569" strokeWidth="2.5" />
          <line x1="155" y1="225" x2="155" y2="150" stroke="#ffffff" strokeWidth="2" opacity="0.4" />

          {/* CuO powder at bottom (black) */}
          {cuoAdded && !dissolved && (
            <>
              <path d="M 158 230 Q 200 220 242 230 Z" fill="#111827" />
              <circle cx="170" cy="225" r="2" fill="#1f2937" />
              <circle cx="185" cy="222" r="2.5" fill="#1f2937" />
              <circle cx="200" cy="220" r="3" fill="#1f2937" />
              <circle cx="215" cy="222" r="2.5" fill="#1f2937" />
              <circle cx="230" cy="225" r="2" fill="#1f2937" />
            </>
          )}

          {/* Stirring rod (when stirring) */}
          {stirring && !dissolved && (
            <motion.g
              animate={{ rotate: [-15, 15, -15] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "200px 200px" }}
            >
              <rect x="198" y="120" width="4" height="115" fill="#92400e" rx="1" />
              <ellipse cx="200" cy="120" rx="4" ry="3" fill="#7c2d12" />
            </motion.g>
          )}
        </g>

        {/* HCl bottle (during add-hcl, before pouring) */}
        {phase === "add-hcl" && !hclAdded && (
          <g>
            <rect x="280" y="190" width="40" height="50" fill="rgba(34,197,94,0.3)" stroke="#16a34a" strokeWidth="2" rx="3" />
            <rect x="290" y="180" width="20" height="12" fill="rgba(34,197,94,0.3)" stroke="#16a34a" strokeWidth="2" />
            <rect x="288" y="174" width="24" height="8" fill="#15803d" rx="1" />
            <rect x="285" y="205" width="30" height="18" fill="#ffffff" stroke="#16a34a" strokeWidth="0.5" rx="1" />
            <text x="300" y="215" textAnchor="middle" fontSize="6" fill="#15803d" fontWeight="bold">HCl</text>
            <text x="300" y="221" textAnchor="middle" fontSize="4" fill="#15803d">(dilute)</text>
          </g>
        )}

        {/* Top label */}
        {phase === "add-cuo" && !cuoAdded && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty beaker — add black CuO powder
          </text>
        )}
        {phase === "add-hcl" && !hclAdded && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Black CuO powder in beaker — add dilute HCl
          </text>
        )}
        {phase === "observe" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            {dissolved ? "✅ CuO dissolved — solution is BLUE-GREEN CuCl₂" : "🟢 Black powder dissolving → blue-green solution"}
          </text>
        )}
      </svg>
    </div>
  );
}
