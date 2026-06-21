"use client";

// ─── Activity 1.5 — Heating Lead Nitrate ─────────────────────────────────────
// Equation: 2Pb(NO₃)₂ →heat→ 2PbO + 4NO₂↑ + O₂↑
// Scene: boiling tube + white crystals + burner → brown NO₂ fumes + yellow PbO + O₂ (splint rekindles)

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type ResidueState = "white" | "yellow";
type Phase = "intro" | "add-crystals" | "heat" | "observe" | "splint" | "classify" | "results";

const TOTAL_STEPS = 5;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-crystals": { title: "Add Lead Nitrate",    instruction: "Take a small amount of LEAD NITRATE crystals [Pb(NO₃)₂ — WHITE crystals] in a DRY boiling tube." },
  "heat":         { title: "Heat the Crystals",   instruction: "Hold the tube with a clamp and heat it over a burner. ⚠️ Do this in a fume hood — NO₂ is toxic." },
  "observe":      { title: "Observe the Products", instruction: "Watch: BROWN FUMES of NO₂ evolve, a YELLOW residue (PbO) forms, and oxygen is released." },
  "splint":       { title: "Test for Oxygen",     instruction: "Bring a GLOWING (not burning) splint to the mouth of the tube. It REKINDLES in oxygen — the standard O₂ test." },
  "classify":     { title: "Classify the Reaction", instruction: "A single reactant (Pb(NO₃)₂) breaks into multiple products. What type of reaction is this?" },
};

const OPTIONS = ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Decomposition";
const EQUATION = "2Pb(NO₃)₂ → 2PbO + 4NO₂↑ + O₂↑";

const RECAP = [
  "Lead nitrate [Pb(NO₃)₂] is a white crystalline salt. On heating, it decomposes into three products: lead oxide (PbO — yellow residue), nitrogen dioxide (NO₂ — brown fumes), and oxygen gas.",
  "The BROWN FUMES are the unmistakable signature of NO₂. Nitrogen dioxide is a toxic, pungent gas — that's why this activity must be performed in a fume hood.",
  "The oxygen released can be confirmed by bringing a GLOWING splint to the mouth of the tube — it REKINDLES in the oxygen-rich atmosphere. This is the standard test for oxygen.",
  "Lead oxide (PbO) exists in two forms: litharge (red, stable at lower temperatures) and massicot (yellow, stable at higher temperatures). The yellow colour seen here is massicot.",
  "All nitrate salts decompose on heating, but the products vary: alkali metal nitrates (NaNO₃, KNO₃) give only the nitrite + O₂; heavy-metal nitrates (Pb(NO₃)₂, Cu(NO₃)₂) give the oxide + NO₂ + O₂.",
];

const SAFETY_NOTES = [
  "⚠️ Perform in a fume hood — NO₂ is a toxic, choking gas.",
  "Lead compounds are toxic — wash hands after handling, do not ingest.",
  "Point the mouth of the boiling tube AWAY from yourself and others.",
];

export function HeatingLeadNitrateActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [residueState, setResidueState] = useState<ResidueState>("white");
  const [crystalsAdded, setCrystalsAdded] = useState(false);
  const [burnerOn, setBurnerOn] = useState(false);
  const [fumes, setFumes] = useState(false);
  const [splintGlowing, setSplintGlowing] = useState(false);
  const [splintRekindled, setSplintRekindled] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-crystals" ? 0 :
    phase === "heat" ? 1 :
    phase === "observe" ? 2 :
    phase === "splint" ? 3 :
    phase === "classify" ? 4 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setResidueState("white"); setCrystalsAdded(false);
    setBurnerOn(false); setFumes(false); setSplintGlowing(false); setSplintRekindled(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleCrystals = useCallback(() => {
    if (phase !== "add-crystals" || crystalsAdded) return;
    setCrystalsAdded(true);
    sfx.playDrop();
    setObservation("WHITE crystals of lead nitrate [Pb(NO₃)₂] added to the dry boiling tube.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, crystalsAdded]);

  const handleBurner = useCallback(() => {
    if (phase !== "heat" || burnerOn) return;
    setBurnerOn(true);
    sfx.playPour();
    setTimeout(() => {
      setResidueState("yellow");
      setFumes(true);
      playReactionSound("effervescence");
      setPhase("observe");
      setObservation("🟤 BROWN FUMES of NO₂ evolve vigorously. A YELLOW residue (PbO) forms. Oxygen gas is also released.");
      setObsVariant("warning");
      setTimeout(() => setShowContinue(true), 2800);
    }, 1500);
  }, [phase, burnerOn]);

  const handleSplint = useCallback(() => {
    if (phase !== "splint") return;
    if (!splintGlowing) {
      setSplintGlowing(true);
      sfx.playDrop();
      setObservation("The splint is GLOWING (a red ember at its tip). Now bring it to the mouth of the tube.");
      setObsVariant("info");
      return;
    }
    if (!splintRekindled) {
      setSplintRekindled(true);
      sfx.playSuccess();
      setObservation("🔥 The glowing splint REKINDLES (bursts back into flame) at the tube mouth! This confirms OXYGEN gas is being released.");
      setObsVariant("success");
      setShowContinue(true);
    }
  }, [phase, splintGlowing, splintRekindled]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-crystals") setPhase("heat");
    else if (phase === "observe") setPhase("splint");
    else if (phase === "splint") setPhase("classify");
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
          emoji="🟤"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 1.5: Heat lead nitrate [Pb(NO₃)₂] in a boiling tube. Observe the brown NO₂ fumes, the yellow PbO residue, and the release of oxygen (rekindles a glowing splint)."
          steps={[
            { title: "Add Lead Nitrate", desc: "Take a small amount of white lead nitrate crystals in a dry boiling tube." },
            { title: "Heat the Crystals", desc: "Hold with a clamp, point mouth away, heat over a burner. Perform in a fume hood." },
            { title: "Observe Brown Fumes", desc: "Watch for: brown NO₂ fumes, yellow PbO residue, and oxygen release." },
            { title: "Test for Oxygen", desc: "A glowing splint rekindles at the tube mouth — confirms O₂." },
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
      <ActivityHeader emoji="🟤" gradient={manifest.gradient} name={manifest.title} category="Chemical Reactions and Equations" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <HeatingLeadNitrateScene
          residueState={residueState}
          crystalsAdded={crystalsAdded}
          burnerOn={burnerOn}
          fumes={fumes}
          splintGlowing={splintGlowing}
          splintRekindled={splintRekindled}
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
          {phase === "add-crystals" && (
            <ToolButton emoji="⚪" label="Pb(NO₃)₂ Crystals" onClick={handleCrystals} disabled={crystalsAdded} highlighted={!crystalsAdded} />
          )}
          {phase === "heat" && (
            <ToolButton emoji="🔥" label="Ignite Burner" onClick={handleBurner} disabled={burnerOn} highlighted={!burnerOn} />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watch the brown fumes and yellow residue form…</div>
          )}
          {phase === "splint" && (
            <ToolButton emoji="🪵" label={splintGlowing ? (splintRekindled ? "Done" : "Bring to tube mouth") : "Light Splint (Glowing)"} onClick={handleSplint} disabled={splintRekindled} highlighted={!splintRekindled} />
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="What type of reaction is 2Pb(NO₃)₂ → 2PbO + 4NO₂ + O₂?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function HeatingLeadNitrateScene({
  residueState, crystalsAdded, burnerOn, fumes, splintGlowing, splintRekindled, phase,
}: {
  residueState: ResidueState; crystalsAdded: boolean; burnerOn: boolean; fumes: boolean;
  splintGlowing: boolean; splintRekindled: boolean; phase: Phase;
}) {
  const residueColor = residueState === "white" ? "#f8fafc" : "#eab308";

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Burner */}
        <ellipse cx="200" cy="240" rx="22" ry="4" fill="#1f2937" />
        <rect x="190" y="225" width="20" height="18" fill="#374151" rx="2" />
        <rect x="196" y="180" width="8" height="50" fill="#4b5563" rx="1" />
        <rect x="193" y="172" width="14" height="10" fill="#1f2937" rx="1" />

        {/* Burner flame */}
        {burnerOn && (
          <motion.g initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} style={{ transformOrigin: "200px 175px" }}>
            <motion.path d="M 200 175 Q 190 145 195 115 Q 200 100 205 115 Q 210 145 200 175 Z" fill="url(#flameOuter)" animate={{ d: ["M 200 175 Q 190 145 195 115 Q 200 100 205 115 Q 210 145 200 175 Z", "M 200 175 Q 188 145 194 110 Q 200 95 206 110 Q 212 145 200 175 Z", "M 200 175 Q 190 145 195 115 Q 200 100 205 115 Q 210 145 200 175 Z"], transition: { duration: 0.4, repeat: Infinity } }} />
            <path d="M 200 175 Q 196 160 198 140 Q 200 132 202 140 Q 204 160 200 175 Z" fill="url(#flameInner)" />
          </motion.g>
        )}

        {/* ─── Retort stand clamp (horizontal arm from the left) ─────────── */}
        <rect x="50" y="100" width="6" height="140" fill="#475569" rx="1" />
        <rect x="30" y="238" width="50" height="6" fill="#1f2937" rx="1" />
        <rect x="55" y="158" width="125" height="6" fill="#475569" rx="1" />
        <rect x="178" y="150" width="14" height="22" fill="#1f2937" rx="2" />
        <rect x="178" y="150" width="14" height="3" fill="#374151" />
        <rect x="178" y="169" width="14" height="3" fill="#374151" />
        <circle cx="185" cy="146" r="3" fill="#6b7280" stroke="#1f2937" strokeWidth="0.5" />

        {/* ─── Boiling tube (VERTICAL, centered above the burner at x=200) ─── */}
        <g>
          <path
            d="M 185 110 L 215 110 L 215 215 Q 215 222 208 222 L 192 222 Q 185 222 185 215 Z"
            fill="rgba(255,255,255,0.15)"
            stroke="#475569"
            strokeWidth="2"
          />
          <rect x="182" y="106" width="36" height="6" fill="none" stroke="#475569" strokeWidth="2" rx="1" />
          <line x1="189" y1="215" x2="189" y2="120" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />

          {/* Residue at the bottom of the tube */}
          {crystalsAdded && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x="186" y="205" width="28" height="14" fill={residueColor} stroke="#1f2937" strokeWidth="0.4" />
              {residueState === "yellow" && (
                <>
                  <circle cx="192" cy="210" r="1.5" fill="#a16207" />
                  <circle cx="200" cy="212" r="2" fill="#a16207" />
                  <circle cx="208" cy="210" r="1.5" fill="#a16207" />
                </>
              )}
            </motion.g>
          )}
        </g>

        {/* ─── Brown NO₂ fumes rising from the tube MOUTH (at x=200, y=106) ── */}
        {fumes && [0, 1, 2, 3, 4].map((i) => (
          <motion.circle
            key={i}
            cx={195 + (i * 3)}
            cy={100}
            r={5 + (i % 3)}
            fill="#78350f"
            opacity={0.6}
            animate={{
              cx: [195 + (i * 3), 190 + (i * 6), 185 + (i * 10)],
              cy: [100, 60, 20],
              opacity: [0.7, 0.4, 0],
              r: [5 + (i % 3), 10 + (i % 3), 15 + (i % 3)],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        {/* ─── Glowing splint (in splint phase) ──────────────────────────── */}
        {/* Starts on the right at (297, 160); swings LEFT to the tube mouth at (200, 106). */}
        {/* Translation: x=-97, y=-54 brings the tip from (297, 160) to (200, 106). */}
        {phase === "splint" && (
          <motion.g
            animate={{
              x: splintGlowing && !splintRekindled ? -97 : 0,
              y: splintGlowing && !splintRekindled ? -54 : 0,
              rotate: splintGlowing && !splintRekindled ? 25 : 0,
            }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
            style={{ transformOrigin: "297px 190px" }}
          >
            {/* Splint stick */}
            <rect x="295" y="160" width="4" height="60" fill="#a16207" rx="1" />
            {/* Splint tip — glowing ember */}
            {splintGlowing && !splintRekindled && (
              <motion.circle cx="297" cy="160" r="3" fill="#dc2626" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 0.5, repeat: Infinity }} />
            )}
            {/* Splint tip — rekindled flame */}
            {splintRekindled && (
              <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "297px 160px" }}>
                <motion.path d="M 297 160 Q 293 152 297 144 Q 301 152 297 160 Z" fill="url(#splintFlame)" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.3, repeat: Infinity }} style={{ transformOrigin: "297px 158px" }} />
                <ellipse cx="297" cy="155" rx="1.5" ry="2" fill="#fef3c7" />
              </motion.g>
            )}
          </motion.g>
        )}

        {/* Labels */}
        {phase === "add-crystals" && !crystalsAdded && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty boiling tube — add Pb(NO₃)₂ crystals
          </text>
        )}
        {phase === "heat" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Pb(NO₃)₂ in tube — ignite burner (⚠️ use fume hood)
          </text>
        )}
        {phase === "observe" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#78350f" fontWeight="bold" opacity="0.8">
            🟤 Brown NO₂ fumes + yellow PbO residue + O₂ released
          </text>
        )}
        {phase === "splint" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="bold" opacity="0.8">
            🔥 Glowing splint rekindles — confirms OXYGEN
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
          <linearGradient id="splintFlame" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
