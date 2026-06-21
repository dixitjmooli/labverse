"use client";

// ─── Activity 1.2 — Zinc + dilute HCl ────────────────────────────────────────
// NCERT Class 10 · Science · Chapter 1 · Activity 1.2
//
// Equation: Zn + 2HCl → ZnCl₂ + H₂↑
//
// Bespoke scene:
//   Step 1: Add zinc granules to a conical flask
//   Step 2: Add dilute HCl from a reagent bottle
//   Step 3: Observe brisk effervescence (H₂ gas bubbles)
//   Step 4: Test the gas with a burning matchstick (pop sound)
//   Step 5: Classify the reaction (Displacement)

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell,
  ActivityIntro,
  ActivityHeader,
  ActivityStepHeader,
  ToolButton,
  ObservationBanner,
  ActivityClassify,
  ActivityResults,
  ContinueButton,
} from "../ActivityPrimitives";

type Phase = "intro" | "add-zinc" | "add-acid" | "observe" | "matchstick" | "classify" | "results";

const TOTAL_STEPS = 5;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-zinc":    { title: "Add Zinc Granules",   instruction: "Tip the zinc granules (silver-grey metal pieces) into the conical flask." },
  "add-acid":    { title: "Add dilute HCl",      instruction: "Pour dilute hydrochloric acid from the reagent bottle into the flask containing the zinc." },
  "observe":     { title: "Observe the Reaction", instruction: "Watch brisk effervescence (bubbling) at the zinc surface. H₂ gas is being released. The flask also warms up — the reaction is exothermic." },
  "matchstick":  { title: "Test the Gas",        instruction: "Bring a burning matchstick to the mouth of the flask. A characteristic 'POP' sound confirms hydrogen gas." },
  "classify":    { title: "Classify the Reaction", instruction: "Zinc (more reactive) displaces hydrogen (less reactive) from HCl. What type of reaction is this?" },
};

const OPTIONS = ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Displacement";
const EQUATION = "Zn + 2HCl → ZnCl₂ + H₂↑";

const RECAP = [
  "Zinc is more reactive than hydrogen, so it displaces hydrogen from dilute HCl. The products are zinc chloride (ZnCl₂ — stays dissolved in solution) and hydrogen gas (escapes as bubbles).",
  "The 'pop' sound test is the standard confirmatory test for H₂: a lighted matchstick at the mouth of the flask ignites the H₂, which burns very rapidly with a characteristic pop.",
  "The reaction is exothermic — the flask becomes warm to the touch. This is typical of metal + acid displacement reactions.",
  "The same reaction works with dilute H₂SO₄ in place of HCl. With dilute HNO₃, however, H₂ does NOT escape — HNO₃ is an oxidising acid and converts H₂ into water, releasing nitrogen oxide fumes instead.",
  "Displacement reactions follow the reactivity series. Any metal above hydrogen (Zn, Fe, Mg, Al, Na, K, Ca) can displace H₂ from dilute acids; metals below hydrogen (Cu, Ag, Au) cannot.",
  "Safety: keep the flask mouth pointed away from your face when igniting the H₂. Pure H₂ pops gently, but H₂ mixed with air can be explosive — flush the flask briefly before the pop test.",
];

const SAFETY_NOTES = [
  "Add acid to the zinc (NOT water to acid) — though here the acid is already dilute.",
  "Keep your face away from the flask mouth when testing for H₂ — the pop can splatter droplets.",
  "Use dilute HCl (~1 M). Concentrated HCl gives off choking fumes.",
];

export function ZincHclActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [zincAdded, setZincAdded] = useState(false);
  const [acidAdded, setAcidAdded] = useState(false);
  const [bubbling, setBubbling] = useState(false);
  const [matchLit, setMatchLit] = useState(false);
  const [matchAtMouth, setMatchAtMouth] = useState(false);
  const [popped, setPopped] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-zinc" ? 0 :
    phase === "add-acid" ? 1 :
    phase === "observe" ? 2 :
    phase === "matchstick" ? 3 :
    phase === "classify" ? 4 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setZincAdded(false); setAcidAdded(false); setBubbling(false);
    setMatchLit(false); setMatchAtMouth(false); setPopped(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleZinc = useCallback(() => {
    if (phase !== "add-zinc" || zincAdded) return;
    setZincAdded(true);
    sfx.playDrop();
    setObservation("Zinc granules (silver-grey metal pieces) have been added to the conical flask.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, zincAdded]);

  const handleAcid = useCallback(() => {
    if (phase !== "add-acid" || acidAdded) return;
    setAcidAdded(true);
    sfx.playPour();
    setTimeout(() => {
      setBubbling(true);
      playReactionSound("effervescence");
      setPhase("observe");
      setObservation("🫧 Brisk EFFERVESCENCE (vigorous bubbling) at the zinc surface! The flask feels WARM (exothermic). H₂ gas is being released.");
      setObsVariant("success");
      setTimeout(() => setShowContinue(true), 2500);
    }, 800);
  }, [phase, acidAdded]);

  const handleMatch = useCallback(() => {
    if (phase !== "matchstick") return;
    if (!matchLit) {
      setMatchLit(true);
      sfx.playDrop();
      setObservation("The matchstick is lit. Now bring it to the mouth of the flask.");
      setObsVariant("info");
      return;
    }
    if (!matchAtMouth) {
      setMatchAtMouth(true);
      sfx.playError();
      setTimeout(() => {
        setPopped(true);
        setBubbling(false);
        playReactionSound("effervescence");
        sfx.playSuccess();
        setObservation("💥 'POP!' The H₂ gas ignites with a characteristic pop sound. This confirms the gas is HYDROGEN.");
        setObsVariant("success");
        setShowContinue(true);
      }, 600);
    }
  }, [phase, matchLit, matchAtMouth]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-zinc") setPhase("add-acid");
    else if (phase === "observe") setPhase("matchstick");
    else if (phase === "matchstick") setPhase("classify");
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
          emoji="🫧"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 1.2: Add dilute hydrochloric acid to zinc granules in a conical flask. Observe the brisk effervescence of H₂ gas and confirm it with the 'pop' test."
          steps={[
            { title: "Add Zinc Granules", desc: "Tip a few zinc granules into a clean, dry conical flask." },
            { title: "Add dilute HCl", desc: "Pour about 5 mL of dilute hydrochloric acid into the flask." },
            { title: "Observe Effervescence", desc: "Watch brisk bubbling at the zinc surface and feel the flask warm up (exothermic)." },
            { title: "Pop Test for H₂", desc: "Bring a burning matchstick to the mouth of the flask. A 'pop' confirms H₂ gas." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-zinc")}
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
      <ActivityHeader emoji="🫧" gradient={manifest.gradient} name={manifest.title} category="Chemical Reactions and Equations" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <ZincHclScene
          zincAdded={zincAdded}
          acidAdded={acidAdded}
          bubbling={bubbling}
          matchLit={matchLit}
          matchAtMouth={matchAtMouth}
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
          {phase === "add-zinc" && (
            <ToolButton emoji="⚗️" label="Zinc Granules" onClick={handleZinc} disabled={zincAdded} highlighted={!zincAdded} />
          )}
          {phase === "add-acid" && (
            <ToolButton emoji="🧴" label="dilute HCl" onClick={handleAcid} disabled={acidAdded} highlighted={!acidAdded} />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watch the brisk effervescence…</div>
          )}
          {phase === "matchstick" && (
            <ToolButton emoji="🔥" label={matchLit ? (matchAtMouth ? "Test done" : "Bring to flask mouth") : "Light Matchstick"} onClick={handleMatch} disabled={popped} highlighted={!popped} />
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify
            question="What type of reaction is Zn + 2HCl → ZnCl₂ + H₂↑?"
            options={OPTIONS}
            onSelect={handleClassify}
            selected={selectedAnswer}
          />
        )}
      </main>
    </ActivityShell>
  );
}

// ─── SVG Scene ───────────────────────────────────────────────────────────────

function ZincHclScene({
  zincAdded,
  acidAdded,
  bubbling,
  matchLit,
  matchAtMouth,
  popped,
  phase,
}: {
  zincAdded: boolean;
  acidAdded: boolean;
  bubbling: boolean;
  matchLit: boolean;
  matchAtMouth: boolean;
  popped: boolean;
  phase: Phase;
}) {
  // Liquid level in the flask: 0 (empty) → 1 (acid added, ~40% fill)
  const liquidPct = acidAdded ? 40 : 0;

  // Liquid colour: clear blue-tinted acid; turns slightly cloudy with ZnCl₂ during reaction
  const liquidColor = bubbling ? "rgba(186,230,253,0.7)" : "rgba(219,234,254,0.7)";

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Bench */}
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* ─── Conical Flask (centered at x=180) ──────────────────────── */}
        <g>
          {/* Liquid inside flask */}
          {acidAdded && (
            <motion.path
              d="M 158 215 L 202 215 L 202 175 L 158 175 Z"
              fill={liquidColor}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              style={{ transformOrigin: "180px 215px" }}
            />
          )}
          {/* Liquid surface */}
          {acidAdded && (
            <motion.ellipse cx="180" cy="175" rx="22" ry="2" fill={liquidColor} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
          )}

          {/* Flask outline (drawn ON TOP of liquid) */}
          {/* Flask body — trapezoid */}
          <path d="M 158 215 L 202 215 L 202 165 L 158 165 Z" fill="none" stroke="#475569" strokeWidth="2" />
          {/* Neck */}
          <rect x="170" y="135" width="20" height="32" fill="none" stroke="#475569" strokeWidth="2" />
          {/* Mouth rim */}
          <rect x="166" y="131" width="28" height="6" fill="none" stroke="#475569" strokeWidth="2" rx="1" />
          {/* Glass shine */}
          <line x1="162" y1="210" x2="162" y2="175" stroke="#ffffff" strokeWidth="2" opacity="0.4" />

          {/* Zinc granules at bottom */}
          {zincAdded && !acidAdded && (
            <>
              <circle cx="168" cy="212" r="3" fill="#9ca3af" stroke="#475569" strokeWidth="0.4" />
              <circle cx="175" cy="213" r="3.5" fill="#9ca3af" stroke="#475569" strokeWidth="0.4" />
              <circle cx="183" cy="212" r="3" fill="#9ca3af" stroke="#475569" strokeWidth="0.4" />
              <circle cx="190" cy="213" r="3.5" fill="#9ca3af" stroke="#475569" strokeWidth="0.4" />
              <circle cx="197" cy="212" r="3" fill="#9ca3af" stroke="#475569" strokeWidth="0.4" />
              <circle cx="178" cy="209" r="2.5" fill="#cbd5e1" stroke="#475569" strokeWidth="0.4" />
              <circle cx="188" cy="209" r="2.5" fill="#cbd5e1" stroke="#475569" strokeWidth="0.4" />
            </>
          )}
          {/* Zinc granules (subtle, through liquid) */}
          {zincAdded && acidAdded && (
            <>
              <circle cx="168" cy="212" r="3" fill="#6b7280" opacity="0.7" />
              <circle cx="175" cy="213" r="3.5" fill="#6b7280" opacity="0.7" />
              <circle cx="183" cy="212" r="3" fill="#6b7280" opacity="0.7" />
              <circle cx="190" cy="213" r="3.5" fill="#6b7280" opacity="0.7" />
              <circle cx="197" cy="212" r="3" fill="#6b7280" opacity="0.7" />
            </>
          )}

          {/* Bubbles rising from zinc surface */}
          {bubbling && [0, 1, 2, 3, 4, 5].map((i) => (
            <motion.circle
              key={i}
              cx={165 + (i * 6)}
              cy={210}
              r={1.5 + (i % 3)}
              fill="#ffffff"
              opacity={0.85}
              animate={{
                cy: [210, 175],
                opacity: [0.9, 0.9, 0],
                r: [1.5 + (i % 3), 2.5 + (i % 3)],
              }}
              transition={{
                duration: 1 + (i * 0.15),
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </g>

        {/* ─── Reagent bottle (right side) — only shown when adding acid ──── */}
        {phase === "add-acid" && !acidAdded && (
          <motion.g
            initial={{ x: 0, y: 0 }}
            animate={{ x: acidAdded ? -40 : 0, y: acidAdded ? -10 : 0 }}
          >
            {/* Bottle body */}
            <rect x="280" y="190" width="40" height="50" fill="rgba(34,197,94,0.3)" stroke="#16a34a" strokeWidth="2" rx="3" />
            {/* Neck */}
            <rect x="290" y="180" width="20" height="12" fill="rgba(34,197,94,0.3)" stroke="#16a34a" strokeWidth="2" />
            {/* Cap */}
            <rect x="288" y="174" width="24" height="8" fill="#15803d" rx="1" />
            {/* Label */}
            <rect x="285" y="205" width="30" height="18" fill="#ffffff" stroke="#16a34a" strokeWidth="0.5" rx="1" />
            <text x="300" y="215" textAnchor="middle" fontSize="6" fill="#15803d" fontWeight="bold">HCl</text>
            <text x="300" y="221" textAnchor="middle" fontSize="4" fill="#15803d">(dilute)</text>
          </motion.g>
        )}

        {/* ─── Matchstick (in matchstick phase) ──────────────────────── */}
        {phase === "matchstick" && (
          <motion.g
            initial={false}
            animate={{
              x: matchAtMouth ? -100 : 0,
              y: matchAtMouth ? 100 : 0,
              rotate: matchAtMouth ? -20 : 0,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
            style={{ transformOrigin: "300px 200px" }}
          >
            {/* Matchstick stick */}
            <rect x="298" y="195" width="3" height="35" fill="#d4a574" rx="1" transform="rotate(180 300 215)" />
            <rect x="298" y="160" width="3" height="35" fill="#d4a574" rx="1" />
            {/* Matchstick head */}
            <ellipse cx="299.5" cy="158" rx="3" ry="4" fill={matchLit ? "#f97316" : "#7c2d12"} />
            {/* Flame on matchstick */}
            {matchLit && !popped && (
              <motion.g
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.3, repeat: Infinity }}
                style={{ transformOrigin: "299.5px 152px" }}
              >
                <path d="M 299 156 Q 295 148 299 142 Q 303 148 299 156 Z" fill="url(#matchFlame)" />
                <ellipse cx="299" cy="153" rx="1.5" ry="2" fill="#fef3c7" />
              </motion.g>
            )}
            {/* Pop explosion */}
            {popped && (
              <motion.g
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2, 2.5], opacity: [1, 0.8, 0] }}
                transition={{ duration: 0.8 }}
                style={{ transformOrigin: "299px 152px" }}
              >
                <circle cx="299" cy="152" r="10" fill="#fef3c7" opacity="0.9" />
                <circle cx="299" cy="152" r="18" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
                <text x="299" y="155" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#dc2626">POP!</text>
              </motion.g>
            )}
          </motion.g>
        )}

        {/* ─── Labels ────────────────────────────────────────────────── */}
        {phase === "add-zinc" && !zincAdded && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty conical flask — add zinc granules first
          </text>
        )}
        {phase === "add-acid" && !acidAdded && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Zinc granules in flask — now add dilute HCl
          </text>
        )}
        {phase === "observe" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            🫧 Brisk effervescence — H₂ gas is being released
          </text>
        )}
        {phase === "matchstick" && !popped && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="bold" opacity="0.8">
            💥 Test the gas with a burning matchstick
          </text>
        )}

        <defs>
          <linearGradient id="matchFlame" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
