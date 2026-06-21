"use client";

// ─── Activity 1.4 — Heating Ferrous Sulphate ─────────────────────────────────
// Equation: 2FeSO₄ →heat→ Fe₂O₃ + SO₂↑ + SO₃↑ (thermal decomposition)
//
// Scene:
//   Step 1: Add FeSO₄·7H₂O crystals (pale green) to a dry boiling tube
//   Step 2: Hold the tube with a clamp and heat it over a burner
//   Step 3: Observe the colour change (green → white → reddish-brown) +
//           smell of burning sulphur (SO₂/SO₃)
//   Step 4: Classify (Decomposition)

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type CrystalState = "green" | "white" | "red-brown";
type Phase = "intro" | "add-crystals" | "heat" | "observe" | "smell" | "classify" | "results";

const TOTAL_STEPS = 5;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-crystals": { title: "Add FeSO₄ Crystals", instruction: "Take a small amount of FERROUS SULPHATE crystals (FeSO₄·7H₂O — pale GREEN crystals) in a DRY boiling tube." },
  "heat":         { title: "Heat the Crystals",  instruction: "Hold the tube with a clamp and heat it gently, then strongly, over a burner. Point the mouth AWAY from your face." },
  "observe":      { title: "Observe Colour Change", instruction: "Watch the colour transition: pale GREEN → WHITE (water of crystallisation lost) → REDDISH-BROWN (decomposition)." },
  "smell":        { title: "Note the Smell",     instruction: "Carefully fan the gas towards your nose (never inhale directly). A smell of BURNING SULPHUR confirms SO₂ and SO₃ evolution." },
  "classify":     { title: "Classify the Reaction", instruction: "A single reactant (FeSO₄) breaks into multiple products. What type of reaction is this?" },
};

const OPTIONS = ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Decomposition";
const EQUATION = "2FeSO₄ → Fe₂O₃ + SO₂↑ + SO₃↑";

const RECAP = [
  "Ferrous sulphate crystals (FeSO₄·7H₂O) contain water of crystallisation, which gives them their pale green colour. On gentle heating, this water is driven off first (the crystals turn white).",
  "On stronger heating, the anhydrous FeSO₄ decomposes into ferric oxide (Fe₂O₃ — reddish-brown), sulphur dioxide (SO₂), and sulphur trioxide (SO₃). This is a THERMAL DECOMPOSITION reaction.",
  "The SO₂ and SO₃ gases have a characteristic choking smell of burning sulphur. They are acidic oxides: bubbled through water, they form sulphurous acid (H₂SO₃) and sulphuric acid (H₂SO₄) respectively.",
  "Ferric oxide (Fe₂O₃) is the same compound as rust (the reddish-brown coating on iron). It is used as a red pigment in paints and as 'jeweller's rouge' for polishing glass and metals.",
  "Decomposition reactions require an input of energy (heat, electricity, or light) — they are ENDOTHERMIC. The reverse process (combination) typically releases energy.",
];

const SAFETY_NOTES = [
  "Do NOT smell the gas directly — fan it gently towards your nose.",
  "Point the mouth of the boiling tube AWAY from yourself and others.",
  "SO₂ is a choking gas — perform the activity in a well-ventilated lab.",
];

export function HeatingFerrousSulphateActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [crystalState, setCrystalState] = useState<CrystalState>("green");
  const [crystalsAdded, setCrystalsAdded] = useState(false);
  const [burnerOn, setBurnerOn] = useState(false);
  const [fumes, setFumes] = useState(false);
  const [sniffed, setSniffed] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-crystals" ? 0 :
    phase === "heat" ? 1 :
    phase === "observe" ? 2 :
    phase === "smell" ? 3 :
    phase === "classify" ? 4 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setCrystalState("green"); setCrystalsAdded(false);
    setBurnerOn(false); setFumes(false); setSniffed(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleCrystals = useCallback(() => {
    if (phase !== "add-crystals" || crystalsAdded) return;
    setCrystalsAdded(true);
    sfx.playDrop();
    setObservation("Pale GREEN crystals of ferrous sulphate (FeSO₄·7H₂O) added to the dry boiling tube.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, crystalsAdded]);

  const handleBurner = useCallback(() => {
    if (phase !== "heat" || burnerOn) return;
    setBurnerOn(true);
    sfx.playPour();
    // Stage 1: green → white (water of crystallisation lost) at ~1.5s
    setTimeout(() => {
      setCrystalState("white");
      setFumes(true);
      playReactionSound("effervescence");
      setObservation("Stage 1: The GREEN crystals turn WHITE — water of crystallisation is being driven off.");
      setObsVariant("info");
    }, 1500);
    // Stage 2: white → red-brown (decomposition) at ~4s
    setTimeout(() => {
      setCrystalState("red-brown");
      sfx.playSuccess();
      setPhase("observe");
      setObservation("Stage 2: The white powder turns REDDISH-BROWN (Fe₂O₃ forms). Brown fumes (SO₂/SO₃) rise with a smell of burning sulphur.");
      setObsVariant("warning");
      setTimeout(() => setShowContinue(true), 2500);
    }, 4000);
  }, [phase, burnerOn]);

  const handleSniff = useCallback(() => {
    if (phase !== "smell" || sniffed) return;
    setSniffed(true);
    sfx.playDrop();
    setObservation("👃 A characteristic smell of BURNING SULPHUR confirms SO₂ and SO₃ gases. The reaction is thermal decomposition.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, sniffed]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-crystals") setPhase("heat");
    else if (phase === "observe") setPhase("smell");
    else if (phase === "smell") setPhase("classify");
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
          emoji="🌡️"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 1.4: Heat ferrous sulphate crystals (FeSO₄·7H₂O) in a dry boiling tube. Observe the colour change (green → white → reddish-brown) and the smell of burning sulphur."
          steps={[
            { title: "Add FeSO₄ Crystals", desc: "Take a small amount of pale green ferrous sulphate crystals in a DRY boiling tube." },
            { title: "Heat Gently, Then Strongly", desc: "Hold with a clamp, point mouth away from your face, and heat over a burner." },
            { title: "Observe Colour Change", desc: "Watch: green → white (water lost) → reddish-brown (decomposition)." },
            { title: "Note the Smell", desc: "Fan the gas towards your nose — a smell of burning sulphur confirms SO₂/SO₃." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-crystals")}
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
      <ActivityHeader emoji="🌡️" gradient={manifest.gradient} name={manifest.title} category="Chemical Reactions and Equations" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <HeatingFerrousSulphateScene crystalState={crystalState} crystalsAdded={crystalsAdded} burnerOn={burnerOn} fumes={fumes} phase={phase} />
        <AnimatePresence mode="wait">
          {observation && (
            <motion.div key={observation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <ObservationBanner text={observation} variant={obsVariant} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3 flex-wrap justify-center">
          {phase === "add-crystals" && (
            <ToolButton emoji="🟢" label="FeSO₄ Crystals" onClick={handleCrystals} disabled={crystalsAdded} highlighted={!crystalsAdded} />
          )}
          {phase === "heat" && (
            <ToolButton emoji="🔥" label="Ignite Burner" onClick={handleBurner} disabled={burnerOn} highlighted={!burnerOn} />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watch the colour change…</div>
          )}
          {phase === "smell" && (
            <ToolButton emoji="👃" label="Sniff (Fan Gently)" onClick={handleSniff} disabled={sniffed} highlighted={!sniffed} />
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="What type of reaction is 2FeSO₄ → Fe₂O₃ + SO₂ + SO₃?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function HeatingFerrousSulphateScene({
  crystalState, crystalsAdded, burnerOn, fumes, phase,
}: {
  crystalState: CrystalState; crystalsAdded: boolean; burnerOn: boolean; fumes: boolean; phase: Phase;
}) {
  const crystalColor =
    crystalState === "green" ? "#86efac" :
    crystalState === "white" ? "#f8fafc" :
    "#b91c1c"; // red-brown

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Bunsen burner (at x=200, base at y=240) */}
        <ellipse cx="200" cy="240" rx="22" ry="4" fill="#1f2937" />
        <rect x="190" y="225" width="20" height="18" fill="#374151" rx="2" />
        <rect x="196" y="180" width="8" height="50" fill="#4b5563" rx="1" />
        <rect x="193" y="172" width="14" height="10" fill="#1f2937" rx="1" />

        {/* Burner flame */}
        {burnerOn && (
          <motion.g initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} style={{ transformOrigin: "200px 175px" }}>
            <motion.path
              d="M 200 175 Q 190 145 195 115 Q 200 100 205 115 Q 210 145 200 175 Z"
              fill="url(#flameOuter)"
              animate={{ d: [
                "M 200 175 Q 190 145 195 115 Q 200 100 205 115 Q 210 145 200 175 Z",
                "M 200 175 Q 188 145 194 110 Q 200 95 206 110 Q 212 145 200 175 Z",
                "M 200 175 Q 190 145 195 115 Q 200 100 205 115 Q 210 145 200 175 Z",
              ], transition: { duration: 0.4, repeat: Infinity } }}
            />
            <path d="M 200 175 Q 196 160 198 140 Q 200 132 202 140 Q 204 160 200 175 Z" fill="url(#flameInner)" />
          </motion.g>
        )}

        {/* ─── Retort stand clamp (horizontal arm from the left) ─────────── */}
        {/* Vertical stand pole on the far left */}
        <rect x="50" y="100" width="6" height="140" fill="#475569" rx="1" />
        {/* Stand base (heavy foot) */}
        <rect x="30" y="238" width="50" height="6" fill="#1f2937" rx="1" />
        {/* Horizontal clamp arm extending right to grip the tube */}
        <rect x="55" y="158" width="125" height="6" fill="#475569" rx="1" />
        {/* Clamp grip jaws gripping the tube at y≈160 */}
        <rect x="178" y="150" width="14" height="22" fill="#1f2937" rx="2" />
        <rect x="178" y="150" width="14" height="3" fill="#374151" />
        <rect x="178" y="169" width="14" height="3" fill="#374151" />
        {/* Clamp screw knob (top) */}
        <circle cx="185" cy="146" r="3" fill="#6b7280" stroke="#1f2937" strokeWidth="0.5" />

        {/* ─── Boiling tube (VERTICAL, centered above the burner at x=200) ─── */}
        {/* Burner flame tip is at y=175; tube bottom sits just above at y=220 */}
        <g>
          {/* Tube body (closed rounded bottom, open top) */}
          <path
            d="M 185 110 L 215 110 L 215 215 Q 215 222 208 222 L 192 222 Q 185 222 185 215 Z"
            fill="rgba(255,255,255,0.15)"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Mouth rim at the top */}
          <rect x="182" y="106" width="36" height="6" fill="none" stroke="#475569" strokeWidth="2" rx="1" />
          {/* Glass shine on the left side */}
          <line x1="189" y1="215" x2="189" y2="120" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />

          {/* Crystals / residue at the bottom of the tube */}
          {crystalsAdded && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x="186" y="205" width="28" height="14" fill={crystalColor} stroke={crystalState === "white" ? "#9ca3af" : "#1f2937"} strokeWidth="0.4" />
              {crystalState === "green" && (
                <>
                  <circle cx="192" cy="210" r="2" fill="#4ade80" />
                  <circle cx="200" cy="212" r="2.5" fill="#4ade80" />
                  <circle cx="208" cy="210" r="2" fill="#4ade80" />
                </>
              )}
              {crystalState === "red-brown" && (
                <>
                  <circle cx="192" cy="210" r="1.5" fill="#7f1d1d" />
                  <circle cx="200" cy="212" r="2" fill="#7f1d1d" />
                  <circle cx="208" cy="210" r="1.5" fill="#7f1d1d" />
                </>
              )}
            </motion.g>
          )}
        </g>

        {/* ─── Brown fumes rising from the tube MOUTH (at x=200, y=106) ────── */}
        {fumes && [0, 1, 2, 3, 4].map((i) => (
          <motion.circle
            key={i}
            cx={195 + (i * 3)}
            cy={100}
            r={4 + (i % 3)}
            fill="#a16207"
            opacity={0.55}
            animate={{
              cx: [195 + (i * 3), 190 + (i * 6), 185 + (i * 10)],
              cy: [100, 60, 20],
              opacity: [0.7, 0.4, 0],
              r: [4 + (i % 3), 8 + (i % 3), 12 + (i % 3)],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.35 }}
          />
        ))}

        {/* Labels */}
        {phase === "add-crystals" && !crystalsAdded && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty boiling tube in clamp — add FeSO₄ crystals
          </text>
        )}
        {phase === "heat" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            FeSO₄ crystals in tube — ignite the burner to heat
          </text>
        )}
        {phase === "observe" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="bold" opacity="0.8">
            {crystalState === "white" ? "Stage 1: GREEN → WHITE (water lost)" : "Stage 2: WHITE → REDDISH-BROWN (decomposition)"}
          </text>
        )}
        {phase === "smell" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#a16207" fontWeight="bold" opacity="0.8">
            👃 Smell of burning sulphur (SO₂/SO₃)
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
