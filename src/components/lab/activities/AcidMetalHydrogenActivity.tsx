"use client";

// ─── Activity 2.3 — Acid + Metal → Salt + H₂↑ ────────────────────────────────
// NCERT Class 10 · Science · Chapter 2 · Activity 2.3
//
// Reactions:
//   Zn + 2HCl   → ZnCl₂  + H₂↑
//   Mg + 2HCl   → MgCl₂  + H₂↑
//   Fe + 2HCl   → FeCl₂  + H₂↑ (slow)
//
// Scene: Three test tubes with acid; drop a different metal into each.
// Bubbles of H₂ form on the metal surface (rate depends on reactivity).
// Burner matchstick at the mouth → 'POP' confirms H₂.

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type Phase = "intro" | "drop-zinc" | "drop-magnesium" | "drop-iron" | "pop-test" | "classify" | "results";

const TOTAL_STEPS = 5;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "drop-zinc":       { title: "Drop Zinc in HCl",       instruction: "Add a piece of ZINC to dilute HCl. Vigorous effervescence of H₂ gas starts immediately." },
  "drop-magnesium":  { title: "Drop Magnesium in HCl",  instruction: "Add a piece of MAGNESIUM ribbon to a fresh tube of dilute HCl. VERY vigorous effervescence — Mg is more reactive than Zn." },
  "drop-iron":       { title: "Drop Iron in HCl",       instruction: "Add an IRON NAIL to a fresh tube of dilute HCl. Slower effervescence — Fe is less reactive than Zn." },
  "pop-test":        { title: "Test for H₂ Gas",        instruction: "Bring a BURNING matchstick to the mouth of the most vigorous tube. A 'POP' sound confirms H₂." },
  "classify":        { title: "Conclude",               instruction: "All three metals released H₂ gas from HCl. What type of reaction is Acid + Metal?" },
};

const OPTIONS = ["Displacement", "Combination", "Decomposition", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Displacement";
const EQUATION = "Metal + Acid → Salt + H₂↑  (e.g., Zn + 2HCl → ZnCl₂ + H₂↑)";

const RECAP = [
  "Acids react with many metals to produce a SALT + HYDROGEN gas. The general equation is: Metal + Acid → Salt + H₂↑. The salt formed depends on the acid and the metal — e.g., Zn + 2HCl → ZnCl₂ + H₂, Mg + 2HCl → MgCl₂ + H₂, Fe + 2HCl → FeCl₂ + H₂.",
  "The rate of effervescence (H₂ release) depends on the metal's position in the REACTIVITY SERIES: Mg > Zn > Fe. Magnesium releases H₂ fastest (most vigorous bubbling), iron slowest. Metals below hydrogen in the series (Cu, Ag, Au) do NOT release H₂ from dilute acids.",
  "The 'POP' test confirms H₂: a lighted matchstick at the mouth of the tube ignites the H₂, which burns rapidly with a characteristic pop. This is the standard test for hydrogen gas.",
  "Not all metals react with all acids: Cu, Ag, Au do NOT release H₂ from dilute HCl or H₂SO₄ (they're below hydrogen in the reactivity series). But they DO react with concentrated HNO₃ (which is an oxidising acid) — though the gas released is not H₂ but nitrogen oxide fumes.",
  "The salt formed stays dissolved in the solution; the H₂ escapes as gas. To recover the salt, you would evaporate the solution — e.g., evaporating Zn + HCl gives white solid ZnCl₂ crystals.",
  "Practical applications: this reaction is used in labs to prepare H₂ gas, in 'hydrogen balloons' (reacting Zn with HCl and collecting the H₂), and historically in observation balloons during wartime.",
];

const SAFETY_NOTES = [
  "Wear safety goggles — acid splashes when metal is added.",
  "Keep the tube mouth pointed away from your face during the pop test.",
  "Use dilute acid only — concentrated acids behave differently and can be dangerous.",
];

const METALS = [
  { id: "zinc",       name: "Zinc",       formula: "Zn", color: "#9ca3af", reactivity: 2 }, // medium
  { id: "magnesium",  name: "Magnesium",  formula: "Mg", color: "#e5e7eb", reactivity: 3 }, // vigorous
  { id: "iron",       name: "Iron",       formula: "Fe", color: "#6b7280", reactivity: 1 }, // slow
] as const;

export function AcidMetalHydrogenActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [dropped, setDropped] = useState<Record<string, boolean>>({ zinc: false, magnesium: false, iron: false });
  const [bubbling, setBubbling] = useState<Record<string, boolean>>({ zinc: false, magnesium: false, iron: false });
  const [popped, setPopped] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "drop-zinc" ? 0 :
    phase === "drop-magnesium" ? 1 :
    phase === "drop-iron" ? 2 :
    phase === "pop-test" ? 3 :
    phase === "classify" ? 4 : 0;

  const reset = useCallback(() => {
    setPhase("intro");
    setDropped({ zinc: false, magnesium: false, iron: false });
    setBubbling({ zinc: false, magnesium: false, iron: false });
    setPopped(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleDrop = useCallback((metalId: string, metalName: string, metalFormula: string, reactivity: number) => {
    if (dropped[metalId]) return;
    setDropped(prev => ({ ...prev, [metalId]: true }));
    sfx.playDrop();
    setTimeout(() => {
      setBubbling(prev => ({ ...prev, [metalId]: true }));
      playReactionSound("effervescence");
      const rate = reactivity === 3 ? "VERY VIGOROUS" : reactivity === 2 ? "VIGOROUS" : "SLOW";
      const comparison = reactivity === 3
        ? "fastest of the three — Mg is the most reactive"
        : reactivity === 2
        ? "brisk — Zn is medium in reactivity"
        : "slow — Fe is less reactive than Zn";
      setObservation(`🫧 ${rate} effervescence on the ${metalName} surface. H₂ gas is being released. The bubbling is ${comparison}.`);
      setObsVariant("success");
      setShowContinue(true);
    }, 500);
  }, [dropped]);

  const handlePop = useCallback(() => {
    if (phase !== "pop-test" || popped) return;
    setPopped(true);
    sfx.playError();
    setTimeout(() => {
      sfx.playSuccess();
      setObservation("💥 'POP!' The burning matchstick at the tube mouth makes a sharp pop. This confirms the gas is HYDROGEN (H₂).");
      setObsVariant("success");
      setShowContinue(true);
    }, 600);
  }, [phase, popped]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "drop-zinc") setPhase("drop-magnesium");
    else if (phase === "drop-magnesium") setPhase("drop-iron");
    else if (phase === "drop-iron") setPhase("pop-test");
    else if (phase === "pop-test") setPhase("classify");
  }, [phase]);

  const handleClassify = useCallback((opt: string) => {
    setSelectedAnswer(opt);
    setTimeout(() => setPhase("results"), 300);
  }, []);

  const correct = selectedAnswer === CORRECT;
  const currentMetalId = phase === "drop-zinc" ? "zinc" : phase === "drop-magnesium" ? "magnesium" : phase === "drop-iron" ? "iron" : null;
  const currentMetal = METALS.find(m => m.id === currentMetalId);

  if (phase === "intro") {
    return (
      <ActivityShell manifest={manifest}>
        <ActivityIntro
          emoji="🫧"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 2.3: Drop zinc, magnesium, and iron into separate tubes of dilute HCl. All three release H₂ gas (at different rates based on reactivity). Confirm with the pop test."
          steps={[
            { title: "Drop Zinc in HCl", desc: "Add a piece of Zn to dilute HCl — vigorous effervescence." },
            { title: "Drop Magnesium in HCl", desc: "Add a piece of Mg to fresh HCl — VERY vigorous effervescence." },
            { title: "Drop Iron in HCl", desc: "Add an iron nail to fresh HCl — slower effervescence." },
            { title: "Pop Test", desc: "Bring a burning matchstick to the most vigorous tube — 'POP' confirms H₂." },
            { title: "Conclude", desc: "Metal + Acid → Salt + H₂. A displacement reaction." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("drop-zinc")}
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
      <ActivityHeader emoji="🫧" gradient={manifest.gradient} name={manifest.title} category="Acids, Bases and Salts" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <AcidMetalScene
          dropped={dropped}
          bubbling={bubbling}
          currentMetalId={currentMetalId}
          popped={popped}
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
          {currentMetal && (
            <ToolButton emoji="🔩" label={`Drop ${currentMetal.name} in HCl`} onClick={() => handleDrop(currentMetal.id, currentMetal.name, currentMetal.formula, currentMetal.reactivity)} disabled={dropped[currentMetal.id]} highlighted={!dropped[currentMetal.id]} />
          )}
          {phase === "pop-test" && (
            <ToolButton emoji="💥" label="Pop Test at Mg tube" onClick={handlePop} disabled={popped} highlighted={!popped} />
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="Metal + Acid → Salt + H₂. What type of reaction is this?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function AcidMetalScene({
  dropped, bubbling, currentMetalId, popped, phase,
}: {
  dropped: Record<string, boolean>;
  bubbling: Record<string, boolean>;
  currentMetalId: string | null;
  popped: boolean;
  phase: Phase;
}) {
  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {METALS.map((metal, i) => {
          const x = 90 + i * 110;
          const isCurrent = currentMetalId === metal.id;
          const isDropped = dropped[metal.id];
          const isBubbling = bubbling[metal.id];

          return (
            <g key={metal.id}>
              {/* Acid liquid */}
              <rect x={x} y={170} width={30} height={60} fill="rgba(34,197,94,0.25)" />
              <ellipse cx={x + 15} cy={170} rx={15} ry={2} fill="rgba(34,197,94,0.25)" />
              {/* Tube outline */}
              <rect x={x - 1} y={140} width={32} height={92} fill="none" stroke="#475569" strokeWidth="2" rx="3" />
              <rect x={x - 4} y={136} width={38} height="6" fill="none" stroke="#475569" strokeWidth="2" rx="1" />
              <line x1={x + 3} y1={225} x2={x + 3} y2={148} stroke="#ffffff" strokeWidth="1" opacity="0.4" />
              {/* Label */}
              <text x={x + 15} y={258} textAnchor="middle" fontSize="8" fill="#1f2937" fontWeight="bold">{metal.formula} + HCl</text>

              {/* Metal piece dropped in (sits at the bottom) */}
              {isDropped && (
                <motion.g initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100, damping: 10 }}>
                  <rect x={x + 8} y={218} width={14} height={6} fill={metal.color} stroke="#1f2937" strokeWidth="0.4" rx="1" />
                </motion.g>
              )}

              {/* Bubbles rising (rate depends on reactivity) */}
              {isBubbling && Array.from({ length: 6 }).map((_, j) => (
                <motion.circle
                  key={j}
                  cx={x + 8 + (j * 2.5)}
                  cy={215}
                  r={1 + (j % 2)}
                  fill="#ffffff"
                  opacity={0.85}
                  animate={{
                    cy: [215, 170],
                    opacity: [0.9, 0.9, 0],
                    r: [1 + (j % 2), 2 + (j % 2)],
                  }}
                  transition={{
                    duration: metal.reactivity === 3 ? 0.7 : metal.reactivity === 2 ? 1.2 : 1.8,
                    repeat: Infinity,
                    delay: j * (metal.reactivity === 3 ? 0.1 : metal.reactivity === 2 ? 0.18 : 0.3),
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Highlight ring around current tube */}
              {isCurrent && !isDropped && (
                <motion.rect
                  x={x - 6} y={132} width={42} height={100}
                  fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" rx="4"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
            </g>
          );
        })}

        {/* Pop test (during pop-test phase) — at the magnesium tube (x=200) */}
        {phase === "pop-test" && (
          <motion.g
            animate={{ y: popped ? 30 : 5 }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
          >
            <rect x="198" y="80" width="4" height="35" fill="#d4a574" rx="1" />
            <ellipse cx="200" cy="78" rx="3" ry="4" fill={popped ? "#f97316" : "#7c2d12"} />
            {popped && (
              <motion.g
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2, 2.5], opacity: [1, 0.8, 0] }}
                transition={{ duration: 0.8 }}
                style={{ transformOrigin: "200px 78px" }}
              >
                <circle cx="200" cy="78" r="10" fill="#fef3c7" opacity="0.9" />
                <text x="200" y="82" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#dc2626">POP!</text>
              </motion.g>
            )}
          </motion.g>
        )}

        {/* Top label */}
        {phase !== "classify" && currentMetalId && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Drop {METALS.find(m => m.id === currentMetalId)?.name} into dilute HCl
          </text>
        )}
        {phase === "pop-test" && !popped && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="bold" opacity="0.8">
            💥 Test the gas at the Mg tube (most vigorous) with a burning matchstick
          </text>
        )}
        {phase === "classify" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            ✅ Mg ＞ Zn ＞ Fe in reactivity — all released H₂
          </text>
        )}
      </svg>
    </div>
  );
}
