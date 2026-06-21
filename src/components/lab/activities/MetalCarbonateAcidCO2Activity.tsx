"use client";

// ─── Activity 2.5 — Metal Carbonate + Acid → Salt + H₂O + CO₂↑ ───────────────
// NCERT Class 10 · Science · Chapter 2 · Activity 2.5
//
// Reaction: CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑
// Confirm CO₂ by passing through lime water (Ca(OH)₂): Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O
// Lime water turns MILKY due to insoluble white CaCO₃.

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type Phase = "intro" | "add-caco3" | "add-hcl" | "observe-co2" | "lime-water" | "classify" | "results";

const TOTAL_STEPS = 5;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-caco3":  { title: "Add Calcium Carbonate",    instruction: "Take a small amount of CALCIUM CARBONATE (CaCO₃ — chalk / marble chips / limestone powder) in a conical flask." },
  "add-hcl":    { title: "Add Dilute HCl",            instruction: "Pour dilute hydrochloric acid onto the CaCO₃. Watch for brisk effervescence — CO₂ gas is being released." },
  "observe-co2":{ title: "Observe Effervescence",     instruction: "Brisk bubbling of CO₂ gas. The gas passes through the delivery tube into the lime water test tube." },
  "lime-water": { title: "Test with Lime Water",      instruction: "CO₂ bubbles through lime water (Ca(OH)₂). The lime water turns MILKY (white) due to insoluble CaCO₃ — confirming CO₂." },
  "classify":   { title: "Conclude",                  instruction: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑. The CO₂ is confirmed by the lime water test. What type of reaction is this?" },
};

const OPTIONS = ["Double Displacement", "Combination", "Decomposition", "Displacement", "Oxidation-Reduction"];
const CORRECT = "Double Displacement";
const EQUATION = "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑    (CO₂ test: lime water turns milky)";

const RECAP = [
  "Metal carbonates react with acids to produce a SALT + WATER + CARBON DIOXIDE gas. The general equation: Metal Carbonate + Acid → Salt + H₂O + CO₂↑. Example: CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑.",
  "The CO₂ gas is confirmed by passing it through LIME WATER (a clear solution of calcium hydroxide, Ca(OH)₂). The lime water turns MILKY because the CO₂ reacts with Ca(OH)₂ to form insoluble white calcium carbonate: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O.",
  "If you keep bubbling CO₂ through the milky lime water, the milkiness DISAPPEARS after a while. This is because excess CO₂ reacts with the insoluble CaCO₃ to form SOLUBLE calcium bicarbonate: CaCO₃ + H₂O + CO₂ → Ca(HCO₃)₂. This is the same reaction that causes stalactites and stalagmites in limestone caves.",
  "All metal carbonates (Na₂CO₃, K₂CO₃, CaCO₃, MgCO₃, ZnCO₃, etc.) react with acids to give CO₂. Even bicarbonates (NaHCO₃ — baking soda) react the same way: NaHCO₃ + HCl → NaCl + H₂O + CO₂↑. This is why baking soda fizzes when mixed with vinegar.",
  "Practical applications: (1) Baking soda + acid in cake batter releases CO₂ bubbles that make the cake rise. (2) Antacids like ENO contain NaHCO₃ + citric acid — they fizz in water to release CO₂, providing relief from acidity. (3) Fire extinguishers use NaHCO₃ + H₂SO₄ to generate CO₂ for smothering fires.",
];

const SAFETY_NOTES = [
  "Wear safety goggles when handling acids.",
  "Do not seal the gas exit — pressure can build up and cause splattering.",
  "Lime water is mildly caustic — avoid skin contact.",
];

export function MetalCarbonateAcidCO2Activity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [caco3Added, setCaco3Added] = useState(false);
  const [hclAdded, setHclAdded] = useState(false);
  const [bubbling, setBubbling] = useState(false);
  const [co2ReachingLime, setCo2ReachingLime] = useState(false);
  const [limeMilky, setLimeMilky] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-caco3" ? 0 :
    phase === "add-hcl" ? 1 :
    phase === "observe-co2" ? 2 :
    phase === "lime-water" ? 3 :
    phase === "classify" ? 4 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setCaco3Added(false); setHclAdded(false); setBubbling(false);
    setCo2ReachingLime(false); setLimeMilky(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleCaco3 = useCallback(() => {
    if (phase !== "add-caco3" || caco3Added) return;
    setCaco3Added(true);
    sfx.playDrop();
    setObservation("White calcium carbonate (CaCO₃ — chalk powder) added to the conical flask.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, caco3Added]);

  const handleHcl = useCallback(() => {
    if (phase !== "add-hcl" || hclAdded) return;
    setHclAdded(true);
    sfx.playPour();
    setTimeout(() => {
      setBubbling(true);
      playReactionSound("effervescence");
      setPhase("observe-co2");
      setObservation("🫧 Brisk effervescence on the CaCO₃ surface! CO₂ gas is being released and travels through the delivery tube toward the lime water.");
      setObsVariant("success");
      setTimeout(() => {
        setCo2ReachingLime(true);
        setShowContinue(true);
      }, 2500);
    }, 800);
  }, [phase, hclAdded]);

  const handleLimeWater = useCallback(() => {
    if (phase !== "lime-water" || limeMilky) return;
    setLimeMilky(true);
    sfx.playSuccess();
    setTimeout(() => {
      setObservation("🥛 The CLEAR lime water turns MILKY WHITE due to insoluble CaCO₃ forming: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O. This confirms the gas is CARBON DIOXIDE.");
      setObsVariant("success");
      setShowContinue(true);
    }, 1000);
  }, [phase, limeMilky]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-caco3") setPhase("add-hcl");
    else if (phase === "observe-co2") setPhase("lime-water");
    else if (phase === "lime-water") setPhase("classify");
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
          desc="NCERT Activity 2.5: React calcium carbonate (CaCO₃) with dilute HCl. CO₂ gas evolves. Pass it through lime water — the lime water turns MILKY, confirming CO₂."
          steps={[
            { title: "Add Calcium Carbonate", desc: "Put CaCO₃ (chalk / marble chips) in a conical flask." },
            { title: "Add Dilute HCl", desc: "Pour HCl onto the CaCO₃ — brisk effervescence of CO₂." },
            { title: "Observe CO₂ Travel", desc: "Gas bubbles through the delivery tube into lime water." },
            { title: "Lime Water Test", desc: "Clear lime water turns milky white — confirms CO₂." },
            { title: "Conclude", desc: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. A double displacement reaction." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-caco3")}
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
        <CarbonateAcidScene
          caco3Added={caco3Added}
          hclAdded={hclAdded}
          bubbling={bubbling}
          co2ReachingLime={co2ReachingLime}
          limeMilky={limeMilky}
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
          {phase === "add-caco3" && (
            <ToolButton emoji="⚪" label="Add CaCO₃" onClick={handleCaco3} disabled={caco3Added} highlighted={!caco3Added} />
          )}
          {phase === "add-hcl" && (
            <ToolButton emoji="🧴" label="Add Dilute HCl" onClick={handleHcl} disabled={hclAdded} highlighted={!hclAdded} />
          )}
          {phase === "observe-co2" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watching CO₂ bubble through the delivery tube…</div>
          )}
          {phase === "lime-water" && (
            <ToolButton emoji="🥛" label="Bubble CO₂ Through Lime Water" onClick={handleLimeWater} disabled={limeMilky} highlighted={!limeMilky} />
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. What type of reaction is this?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function CarbonateAcidScene({
  caco3Added, hclAdded, bubbling, co2ReachingLime, limeMilky, phase,
}: {
  caco3Added: boolean; hclAdded: boolean; bubbling: boolean;
  co2ReachingLime: boolean; limeMilky: boolean; phase: Phase;
}) {
  // Conical flask at left (x=80-180), delivery tube going right-down to lime water tube (x=280-330)
  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Conical flask (left, x=80-180) */}
        <g>
          {/* Liquid (acid + CaCO₃) */}
          {hclAdded && (
            <path d="M 95 215 L 165 215 L 175 175 L 85 175 Z" fill="rgba(34,197,94,0.25)" />
          )}
          {/* Flask outline (Erlenmeyer) */}
          <path
            d="M 96 132 L 144 132 L 144 138 L 140 138 L 140 165 L 175 215 L 85 215 L 110 165 L 110 138 L 106 138 Z"
            fill="rgba(255,255,255,0.12)"
            stroke="#475569"
            strokeWidth="2"
          />
          <line x1="95" y1="210" x2="108" y2="172" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />

          {/* CaCO₃ powder at bottom */}
          {caco3Added && !hclAdded && (
            <>
              <path d="M 90 215 Q 130 207 170 215 Z" fill="#f8fafc" />
              <circle cx="105" cy="210" r="2" fill="#e2e8f0" />
              <circle cx="130" cy="208" r="2.5" fill="#e2e8f0" />
              <circle cx="155" cy="210" r="2" fill="#e2e8f0" />
            </>
          )}

          {/* Bubbles in flask */}
          {bubbling && [0, 1, 2, 3, 4].map((i) => (
            <motion.circle
              key={i}
              cx={105 + (i * 12)}
              cy={210}
              r={1.5 + (i % 2)}
              fill="#ffffff"
              opacity={0.85}
              animate={{
                cy: [210, 175],
                opacity: [0.9, 0.9, 0],
                r: [1.5 + (i % 2), 2.5 + (i % 2)],
              }}
              transition={{ duration: 1 + (i * 0.1), repeat: Infinity, delay: i * 0.15, ease: "easeOut" }}
            />
          ))}
        </g>

        {/* Delivery tube (from flask mouth up, then right, then down into lime water tube) */}
        {hclAdded && (
          <path
            d="M 120 130 L 120 100 L 280 100 L 280 145"
            fill="none"
            stroke="#475569"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {/* CO₂ particles travelling through the delivery tube */}
        {co2ReachingLime && [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={120}
            cy={100}
            r={2}
            fill="#94a3b8"
            opacity={0.8}
            animate={{
              cx: [120, 200, 280, 280],
              cy: [100, 100, 100, 145],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        {/* Lime water test tube (right, x=270-310) */}
        <g>
          {/* Lime water liquid — clear (transparent blue tint) when fresh, milky white when CO₂ has passed */}
          <rect x="272" y="160" width="32" height="65" fill={limeMilky ? "rgba(248,250,252,0.95)" : "rgba(219,234,254,0.5)"} />
          <ellipse cx="288" cy="160" rx="16" ry="2" fill={limeMilky ? "rgba(248,250,252,0.95)" : "rgba(219,234,254,0.5)"} />
          {/* Tube outline */}
          <path d="M 272 130 L 304 130 L 304 220 Q 304 226 298 226 L 278 226 Q 272 226 272 220 Z" fill="none" stroke="#475569" strokeWidth="2" />
          <rect x="268" y="126" width="40" height="6" fill="none" stroke="#475569" strokeWidth="2" rx="1" />
          <line x1="276" y1="218" x2="276" y2="135" stroke="#ffffff" strokeWidth="1" opacity={limeMilky ? 0 : 0.4} />
          {/* Label */}
          <text x="288" y="246" textAnchor="middle" fontSize="8" fill="#1f2937" fontWeight="bold">Lime Water</text>
          <text x="288" y="256" textAnchor="middle" fontSize="7" fill="#1f2937">Ca(OH)₂</text>

          {/* Bubbles in lime water */}
          {co2ReachingLime && [0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={288}
              cy={220}
              r={1.5 + (i % 2)}
              fill="#ffffff"
              opacity={0.7}
              animate={{
                cy: [220, 160],
                opacity: [0.8, 0.8, 0],
              }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.25, ease: "easeOut" }}
            />
          ))}
        </g>

        {/* Top label */}
        {phase === "add-caco3" && !caco3Added && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty conical flask — add CaCO₃ (chalk / marble chips)
          </text>
        )}
        {phase === "add-hcl" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            CaCO₃ in flask — pour dilute HCl onto it
          </text>
        )}
        {phase === "observe-co2" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            🫧 CO₂ gas is travelling through the delivery tube
          </text>
        )}
        {phase === "lime-water" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.8">
            {limeMilky ? "🥛 Lime water turned MILKY — CO₂ confirmed!" : "Bubble the CO₂ through lime water"}
          </text>
        )}
      </svg>
    </div>
  );
}
