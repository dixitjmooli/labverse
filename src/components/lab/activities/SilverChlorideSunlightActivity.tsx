"use client";

// ─── Activity 1.6 — Silver Chloride in Sunlight ──────────────────────────────
// Equation: 2AgCl →sunlight→ 2Ag + Cl₂↑ (photolytic decomposition)
// Scene: watch glass + white AgCl powder + sun → grey silver metal forms gradually

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type PowderState = "white" | "light-grey" | "grey";
type Phase = "intro" | "add-powder" | "sunlight" | "observe" | "classify" | "results";

const TOTAL_STEPS = 4;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-powder": { title: "Add Silver Chloride",   instruction: "Place a small amount of SILVER CHLORIDE (AgCl — WHITE powder) in a watch glass or Petri dish." },
  "sunlight":   { title: "Place in Sunlight",     instruction: "Place the watch glass in bright sunlight. Photolytic decomposition is slow — be patient." },
  "observe":    { title: "Observe the Colour Change", instruction: "The white powder gradually turns GREY as SILVER METAL forms. Chlorine gas is also released. (This is the basis of black-and-white photography.)" },
  "classify":   { title: "Classify the Reaction", instruction: "A single reactant (AgCl) breaks into two products (Ag + Cl₂) using light energy. What type of reaction is this?" },
};

const OPTIONS = ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Decomposition";
const EQUATION = "2AgCl → 2Ag + Cl₂↑";

const RECAP = [
  "Silver chloride (AgCl) decomposes into silver (Ag) and chlorine (Cl₂) when exposed to sunlight. The white powder gradually turns grey because metallic silver is grey.",
  "This is a PHOTOLYTIC decomposition — the energy required to break the Ag–Cl bond comes from photons of light, not from heat or electricity. It is the third type of decomposition (alongside thermal and electrolytic).",
  "Silver BROMIDE (AgBr) behaves similarly and is the actual compound used in traditional black-and-white photographic film. When light hits the film, tiny crystals of AgBr decompose into silver metal — the more light, the more silver, which creates the image.",
  "Silver iodide (AgI) is also light-sensitive and is used in cloud seeding — dispersing AgI crystals into clouds encourages water droplets to form, inducing rain.",
  "Photolytic reactions are slower than thermal reactions because the energy delivered per photon is small. The colour change here is gradual — patience (and bright sunlight) is needed.",
];

const SAFETY_NOTES = [
  "Avoid direct skin contact with silver salts — they can stain skin black.",
  "Perform in a well-ventilated area — chlorine gas is released.",
  "Use a watch glass or Petri dish; do not use a metal container.",
];

export function SilverChlorideSunlightActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [powderState, setPowderState] = useState<PowderState>("white");
  const [powderAdded, setPowderAdded] = useState(false);
  const [sunlightOn, setSunlightOn] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-powder" ? 0 :
    phase === "sunlight" ? 1 :
    phase === "observe" ? 2 :
    phase === "classify" ? 3 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setPowderState("white"); setPowderAdded(false); setSunlightOn(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handlePowder = useCallback(() => {
    if (phase !== "add-powder" || powderAdded) return;
    setPowderAdded(true);
    sfx.playDrop();
    setObservation("WHITE AgCl powder placed on the watch glass.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, powderAdded]);

  const handleSunlight = useCallback(() => {
    if (phase !== "sunlight" || sunlightOn) return;
    setSunlightOn(true);
    sfx.playPour();
    setPhase("observe");
    setObservation("☀️ The watch glass is now in bright sunlight. Watch the powder slowly change colour…");
    setObsVariant("info");
    // Stage 1: white → light grey at ~2s
    setTimeout(() => {
      setPowderState("light-grey");
      playReactionSound("color-change");
      setObservation("Stage 1: The white powder is turning LIGHT GREY — silver metal is starting to form.");
      setObsVariant("info");
    }, 2000);
    // Stage 2: light grey → grey at ~4s
    setTimeout(() => {
      setPowderState("grey");
      sfx.playSuccess();
      setObservation("✅ Stage 2: The powder is now distinctly GREY. Metallic silver has formed. Chlorine gas has been released. The reaction is complete.");
      setObsVariant("success");
      setShowContinue(true);
    }, 4500);
  }, [phase, sunlightOn]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-powder") setPhase("sunlight");
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
          emoji="☀️"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 1.6: Take silver chloride (AgCl) in a watch glass and place it in sunlight. Observe the white powder turn grey as silver metal forms — a photolytic decomposition."
          steps={[
            { title: "Add Silver Chloride", desc: "Place about 2 g of white AgCl powder in a watch glass or Petri dish." },
            { title: "Place in Sunlight", desc: "Put the watch glass in bright sunlight for several minutes." },
            { title: "Observe", desc: "Watch the white powder gradually turn grey as metallic silver forms." },
            { title: "Connect to Photography", desc: "The same reaction with AgBr is what captures an image on traditional photographic film." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-powder")}
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
      <ActivityHeader emoji="☀️" gradient={manifest.gradient} name={manifest.title} category="Chemical Reactions and Equations" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <SilverChlorideScene powderState={powderState} powderAdded={powderAdded} sunlightOn={sunlightOn} phase={phase} />
        <AnimatePresence mode="wait">
          {observation && (
            <motion.div key={observation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <ObservationBanner text={observation} variant={obsVariant} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3 flex-wrap justify-center">
          {phase === "add-powder" && (
            <ToolButton emoji="⚪" label="AgCl Powder" onClick={handlePowder} disabled={powderAdded} highlighted={!powderAdded} />
          )}
          {phase === "sunlight" && (
            <ToolButton emoji="☀️" label="Place in Sunlight" onClick={handleSunlight} disabled={sunlightOn} highlighted={!sunlightOn} />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watching the gradual colour change…</div>
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="What type of reaction is 2AgCl → 2Ag + Cl₂ (in sunlight)?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function SilverChlorideScene({
  powderState, powderAdded, sunlightOn, phase,
}: {
  powderState: PowderState; powderAdded: boolean; sunlightOn: boolean; phase: Phase;
}) {
  const powderColor =
    powderState === "white" ? "#f8fafc" :
    powderState === "light-grey" ? "#cbd5e1" :
    "#6b7280";

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{
        aspectRatio: "4 / 3",
        background: sunlightOn
          ? "linear-gradient(to bottom, #fef9c3 0%, #fef08a 50%, #d4a574 55%, #b8845e 100%)"
          : "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)",
      }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Sun (when sunlight on) */}
        {sunlightOn && (
          <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ transformOrigin: "60px 60px" }}>
            <circle cx="60" cy="60" r="22" fill="#facc15" />
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 60 + Math.cos(rad) * 28;
              const y1 = 60 + Math.sin(rad) * 28;
              const x2 = 60 + Math.cos(rad) * 38;
              const y2 = 60 + Math.sin(rad) * 38;
              return <motion.line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="3" strokeLinecap="round" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity, delay: angle * 0.005 }} />;
            })}
            {/* Sun glow */}
            <motion.circle cx="60" cy="60" r="30" fill="#fef3c7" opacity="0.4" animate={{ r: [28, 35, 28], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
          </motion.g>
        )}

        {/* Watch glass (circular concave glass) — centered at x=240, y=200 */}
        <g>
          {/* Glass outer ring (ellipse for perspective) */}
          <ellipse cx="240" cy="200" rx="70" ry="18" fill="rgba(255,255,255,0.15)" stroke="#475569" strokeWidth="2.5" />
          {/* Inner concave shape */}
          <ellipse cx="240" cy="198" rx="64" ry="14" fill="rgba(255,255,255,0.08)" stroke="#94a3b8" strokeWidth="1" />
          {/* Glass shine */}
          <ellipse cx="200" cy="192" rx="15" ry="3" fill="#ffffff" opacity="0.5" />

          {/* Powder pile in the watch glass */}
          {powderAdded && (
            <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: "240px 198px" }}>
              <ellipse cx="240" cy="198" rx="40" ry="9" fill={powderColor} stroke={powderState === "white" ? "#cbd5e1" : "#475569"} strokeWidth="0.5" />
              {/* Powder texture dots */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <circle
                  key={i}
                  cx={220 + (i * 5)}
                  cy={195 + (i % 2) * 3}
                  r="1.2"
                  fill={powderState === "white" ? "#e2e8f0" : powderState === "light-grey" ? "#94a3b8" : "#374151"}
                  opacity={0.7}
                />
              ))}
            </motion.g>
          )}

          {/* Cl₂ gas bubbles rising (when reaction is happening) */}
          {sunlightOn && powderState !== "grey" && powderAdded && [0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={235 + (i * 8)}
              cy={195}
              r={2 + (i % 2)}
              fill="#86efac"
              opacity={0.6}
              animate={{
                cy: [195, 130, 60],
                opacity: [0.7, 0.4, 0],
                r: [2 + (i % 2), 4 + (i % 2), 6 + (i % 2)],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
            />
          ))}
        </g>

        {/* Labels */}
        {phase === "add-powder" && !powderAdded && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty watch glass — add AgCl powder
          </text>
        )}
        {phase === "sunlight" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            White AgCl powder in watch glass — place in sunlight
          </text>
        )}
        {phase === "observe" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            {powderState === "white" ? "Watching…" : powderState === "light-grey" ? "Stage 1: White → Light grey" : "Stage 2: Light grey → Grey (silver metal)"}
          </text>
        )}
      </svg>
    </div>
  );
}
