"use client";

// ─── Activity 1.1 — Burning Magnesium Ribbon ─────────────────────────────────
// NCERT Class 10 · Science · Chapter 1 · Activity 1.1
//
// Bespoke scene-based simulation. The user performs the activity step-by-step:
//   Step 1: Clean the ribbon with sandpaper   (dull grey → shiny silver)
//   Step 2: Pick up the ribbon with tongs     (tongs appear holding ribbon)
//   Step 3: Bring the ribbon to the burner    (ribbon moves over flame)
//   Step 4: Ignite the burner                 (brilliant white flame → white ash)
//   Step 5: Classify the reaction             (Combination)
//
// Visuals: SVG scene with a workbench, sandpaper, tongs, magnesium ribbon,
// bunsen burner, flame, and ash — animated with Framer Motion.

import { useState, useCallback, useEffect } from "react";
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

type Phase = "intro" | "clean" | "hold" | "ignite" | "observe" | "classify" | "results";

type RibbonState = "dirty" | "clean" | "burning" | "ash";

const TOTAL_STEPS = 5; // clean, hold, ignite, observe, classify

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  clean:    { title: "Clean the Ribbon",  instruction: "The magnesium ribbon has a dull oxide coating. Pick up the sandpaper and rub it on the ribbon until it shines." },
  hold:     { title: "Hold with Tongs",   instruction: "The ribbon is now clean and shiny. Pick up the tongs — never hold magnesium with bare fingers (it burns at 3100°C)." },
  ignite:   { title: "Bring to Burner",   instruction: "The tongs are holding the ribbon. Now turn on the burner to ignite it. ⚠️ Do NOT stare at the flame — it can damage your eyes." },
  observe:  { title: "Observe the Reaction", instruction: "The ribbon burns with a dazzling white flame, leaving behind a white ash (MgO). Wait for the flame to subside." },
  classify: { title: "Classify the Reaction", instruction: "Based on your observation, what type of reaction is 2Mg + O₂ → 2MgO?" },
};

const OPTIONS = ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Combination";
const EQUATION = "2Mg + O₂ → 2MgO";

const RECAP = [
  "Magnesium burns in air to form magnesium oxide (MgO). Two elements (Mg + O₂) combine into a single compound — this is a COMBINATION reaction.",
  "The dazzling white flame is the energy released as new Mg–O bonds form. The same bright light is why magnesium is used in fireworks, flares, and old-style photographic flashbulbs.",
  "Since magnesium GAINS oxygen, it is also an OXIDATION reaction. A combination reaction can simultaneously be an oxidation — the two classifications are not mutually exclusive.",
  "The white ash (MgO) is basic in nature. If you dissolve it in water and test with red litmus paper, the litmus will turn blue, confirming the product is a basic oxide.",
  "Safety: NEVER look directly at burning magnesium — the UV-rich white light can permanently damage your retina. Always use tongs (not bare fingers), and perform the activity in a well-ventilated lab.",
  "The cleaning step (rubbing with sandpaper) removes the dull layer of magnesium oxide that naturally forms on the ribbon in air. Without this coating, the bare metal ignites much more easily.",
];

const SAFETY_NOTES = [
  "Hold the magnesium ribbon with tongs, never with bare fingers.",
  "Do NOT look directly at the burning magnesium — the brilliant white flame can permanently damage your eyes.",
  "Perform the activity in a well-ventilated laboratory.",
  "Keep a watch-glass or sand-tray underneath to catch any falling ash.",
];

export function BurningMagnesiumActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [ribbonState, setRibbonState] = useState<RibbonState>("dirty");
  const [tongsHolding, setTongsHolding] = useState(false);
  const [burnerOn, setBurnerOn] = useState(false);
  const [sandpaperRubbing, setSandpaperRubbing] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [observationVariant, setObservationVariant] = useState<"info" | "success" | "warning">("info");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showContinue, setShowContinue] = useState(false);

  // Step index for the header progress bar (0-indexed)
  const stepIndex =
    phase === "clean" ? 0 :
    phase === "hold" ? 1 :
    phase === "ignite" ? 2 :
    phase === "observe" ? 3 :
    phase === "classify" ? 4 : 0;

  const reset = useCallback(() => {
    setPhase("intro");
    setRibbonState("dirty");
    setTongsHolding(false);
    setBurnerOn(false);
    setSandpaperRubbing(false);
    setObservation(null);
    setSelectedAnswer(null);
    setShowContinue(false);
  }, []);

  const start = useCallback(() => {
    setPhase("clean");
    setObservation(null);
  }, []);

  // ─── Step 1: Clean ribbon with sandpaper ─────────────────────────────────
  const handleSandpaper = useCallback(() => {
    if (phase !== "clean" || sandpaperRubbing) return;
    setSandpaperRubbing(true);
    sfx.playPour();
    setObservation(null);
    // After ~1.8s of rubbing animation, the ribbon becomes clean
    setTimeout(() => {
      setRibbonState("clean");
      setSandpaperRubbing(false);
      sfx.playSuccess();
      setObservation("The ribbon is now SHINY SILVER — the dull oxide coating has been removed. It's ready to ignite.");
      setObservationVariant("success");
      setShowContinue(true);
    }, 1800);
  }, [phase, sandpaperRubbing]);

  // ─── Step 2: Pick up with tongs ──────────────────────────────────────────
  const handleTongs = useCallback(() => {
    if (phase !== "hold") return;
    setTongsHolding(true);
    sfx.playDrop();
    setObservation("The tongs grip the ribbon firmly. You can now safely bring it to the flame.");
    setObservationVariant("success");
    setShowContinue(true);
  }, [phase]);

  // ─── Step 3 & 4: Ignite burner → ribbon burns ────────────────────────────
  const handleBurner = useCallback(() => {
    if (phase !== "ignite") return;
    setBurnerOn(true);
    sfx.playPour();
    // After 0.6s the burner flame reaches the ribbon and it ignites
    setTimeout(() => {
      setRibbonState("burning");
      playReactionSound("color-change");
      setPhase("observe");
      setObservation("🔥 The magnesium ribbon burns with a DAZZLING WHITE FLAME! Intense white light fills the scene. ⚠️ Do NOT stare directly at it.");
      setObservationVariant("warning");
      setShowContinue(false);
      // After 3.5s, the flame subsides and only ash remains
      setTimeout(() => {
        setRibbonState("ash");
        setBurnerOn(false);
        sfx.playSuccess();
        setObservation("The flame has subsided. A powdery WHITE ASH (MgO) remains on the tongs. The reaction is complete.");
        setObservationVariant("success");
        setShowContinue(true);
      }, 3500);
    }, 600);
  }, [phase]);

  // ─── Continue button: advance to next phase ──────────────────────────────
  const handleContinue = useCallback(() => {
    setShowContinue(false);
    setObservation(null);
    if (phase === "clean") setPhase("hold");
    else if (phase === "hold") setPhase("ignite");
    else if (phase === "observe") setPhase("classify");
  }, [phase]);

  // ─── Classify: lock in answer → results ──────────────────────────────────
  const handleClassify = useCallback((opt: string) => {
    setSelectedAnswer(opt);
    setTimeout(() => setPhase("results"), 300);
  }, []);

  const correct = selectedAnswer === CORRECT;

  // ─── Render ──────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <ActivityShell manifest={manifest}>
        <ActivityIntro
          emoji="🔥"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 1.1: Hold a magnesium ribbon with tongs, ignite it over a burner, and observe the dazzling white flame and the white ash (MgO) formed."
          steps={[
            { title: "Clean the Ribbon", desc: "Use sandpaper to remove the dull oxide coating until the ribbon is shiny silver." },
            { title: "Hold with Tongs", desc: "Pick up the clean ribbon with a pair of tongs. Never use bare fingers — magnesium burns at ~3100°C." },
            { title: "Ignite over Burner", desc: "Bring the ribbon to the burner flame. The ribbon ignites with a dazzling white light." },
            { title: "Observe & Classify", desc: "Note the white ash (MgO) left behind, then classify the reaction type." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={start}
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

  // ─── Main scene phase ────────────────────────────────────────────────────
  const stepInfo = STEPS[phase as Exclude<Phase, "intro" | "results">];

  return (
    <ActivityShell manifest={manifest}>
      <ActivityHeader
        emoji="🔥"
        gradient={manifest.gradient}
        name={manifest.title}
        category="Chemical Reactions and Equations"
        stepNumber={stepIndex}
        totalSteps={TOTAL_STEPS}
        onReset={reset}
      />

      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader
          stepNumber={stepIndex + 1}
          totalSteps={TOTAL_STEPS}
          title={stepInfo.title}
          instruction={stepInfo.instruction}
        />

        {/* ─── The SVG Scene ───────────────────────────────────────────── */}
        <BurningMagnesiumScene
          ribbonState={ribbonState}
          tongsHolding={tongsHolding}
          burnerOn={burnerOn}
          sandpaperRubbing={sandpaperRubbing}
          phase={phase}
        />

        {/* ─── Observation banner ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {observation && (
            <motion.div key={observation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <ObservationBanner text={observation} variant={observationVariant} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Tool buttons (contextual) ──────────────────────────────── */}
        <div className="flex gap-3 flex-wrap justify-center">
          {phase === "clean" && (
            <ToolButton
              emoji="🟫"
              label="Sandpaper"
              onClick={handleSandpaper}
              disabled={sandpaperRubbing || ribbonState === "clean"}
              highlighted={ribbonState !== "clean"}
            />
          )}
          {phase === "hold" && (
            <ToolButton
              emoji="🤏"
              label="Tongs"
              onClick={handleTongs}
              disabled={tongsHolding}
              highlighted={!tongsHolding}
            />
          )}
          {phase === "ignite" && (
            <ToolButton
              emoji="🔥"
              label="Ignite Burner"
              onClick={handleBurner}
              disabled={burnerOn}
              highlighted={!burnerOn}
            />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watch the reaction unfold…</div>
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">
              Scroll down to choose your answer ↓
            </div>
          )}
        </div>

        {/* ─── Continue button ────────────────────────────────────────── */}
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}

        {/* ─── Classify card ──────────────────────────────────────────── */}
        {phase === "classify" && (
          <ActivityClassify
            question="What type of reaction is 2Mg + O₂ → 2MgO?"
            options={OPTIONS}
            onSelect={handleClassify}
            selected={selectedAnswer}
          />
        )}
      </main>
    </ActivityShell>
  );
}

// ─── The SVG Scene ───────────────────────────────────────────────────────────
// Renders a lab workbench with the bunsen burner, sandpaper, tongs, ribbon,
// flame, and ash — all positioned by current state.

function BurningMagnesiumScene({
  ribbonState,
  tongsHolding,
  burnerOn,
  sandpaperRubbing,
  phase,
}: {
  ribbonState: RibbonState;
  tongsHolding: boolean;
  burnerOn: boolean;
  sandpaperRubbing: boolean;
  phase: Phase;
}) {
  // Ribbon Y position depends on whether it's being held over the burner
  const ribbonY = tongsHolding ? 130 : 235; // 235 = on bench, 130 = over burner
  const ribbonX = tongsHolding ? 250 : 100; // 100 = on bench left, 250 = over burner (above burner)

  // Sandpaper animation: oscillate horizontally when rubbing
  const sandpaperX = sandpaperRubbing ? 80 : 320; // moves to ribbon position when rubbing
  const sandpaperAnim = sandpaperRubbing
    ? { x: [0, 30, 0, 30, 0], transition: { duration: 1.8, ease: "easeInOut" as const } }
    : {};

  // Ribbon color depends on state
  const ribbonFill =
    ribbonState === "dirty" ? "#9ca3af" :
    ribbonState === "clean" ? "#e5e7eb" :
    ribbonState === "burning" ? "#ffffff" :
    "#f8fafc"; // ash

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* ─── Workbench top surface ─────────────────────────────────── */}
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />
        {/* Wood grain */}
        {[0, 60, 120, 180, 240, 300, 360].map((x) => (
          <line key={x} x1={x} y1="245" x2={x + 40} y2="295" stroke="#7a4f2a" strokeWidth="0.5" opacity="0.4" />
        ))}

        {/* ─── Bunsen Burner (at x=250) ─────────────────────────────── */}
        {/* Base */}
        <ellipse cx="250" cy="240" rx="22" ry="4" fill="#1f2937" />
        <rect x="240" y="225" width="20" height="18" fill="#374151" rx="2" />
        {/* Tube */}
        <rect x="246" y="180" width="8" height="50" fill="#4b5563" rx="1" />
        {/* Top nozzle */}
        <rect x="243" y="172" width="14" height="10" fill="#1f2937" rx="1" />
        {/* Air vents */}
        <line x1="248" y1="195" x2="252" y2="195" stroke="#1f2937" strokeWidth="0.8" />
        <line x1="248" y1="205" x2="252" y2="205" stroke="#1f2937" strokeWidth="0.8" />

        {/* ─── Burner flame (when on) ────────────────────────────────── */}
        {burnerOn && (
          <motion.g
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            style={{ transformOrigin: "250px 175px" }}
          >
            {/* Outer orange flame */}
            <motion.path
              d="M 250 175 Q 240 145 245 115 Q 250 100 255 115 Q 260 145 250 175 Z"
              fill="url(#flameOuter)"
              animate={{ d: [
                "M 250 175 Q 240 145 245 115 Q 250 100 255 115 Q 260 145 250 175 Z",
                "M 250 175 Q 238 145 244 110 Q 250 95 256 110 Q 262 145 250 175 Z",
                "M 250 175 Q 240 145 245 115 Q 250 100 255 115 Q 260 145 250 175 Z",
              ], transition: { duration: 0.4, repeat: Infinity } }}
            />
            {/* Inner blue cone */}
            <path d="M 250 175 Q 246 160 248 140 Q 250 132 252 140 Q 254 160 250 175 Z" fill="url(#flameInner)" />
          </motion.g>
        )}

        {/* ─── Sandpaper (rectangular block) ────────────────────────── */}
        <motion.g
          animate={sandpaperAnim}
          style={{ transformOrigin: `${sandpaperX + 20}px 240px` }}
        >
          <rect x={sandpaperX} y={225} width={40} height={15} fill="#a16207" rx="2" />
          <rect x={sandpaperX} y={225} width={40} height={4} fill="#7c4d0c" rx="2" />
          {/* Sandpaper grit texture */}
          {[5, 12, 19, 26, 33].map((dx) => (
            <circle key={dx} cx={sandpaperX + dx} cy={230} r="0.8" fill="#fef3c7" opacity="0.6" />
          ))}
        </motion.g>

        {/* ─── Tongs ────────────────────────────────────────────────── */}
        {tongsHolding ? (
          <motion.g
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            {/* Tongs arm coming from the left */}
            <line x1="20" y1="120" x2={ribbonX - 20} y2={ribbonY + 5} stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
            <line x1="20" y1="135" x2={ribbonX - 20} y2={ribbonY + 12} stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
            {/* Handle */}
            <rect x="10" y="115" width="14" height="25" fill="#374151" rx="3" />
          </motion.g>
        ) : (
          /* Tongs resting on bench */
          <g>
            <line x1="40" y1="240" x2="100" y2="240" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
            <line x1="40" y1="245" x2="100" y2="245" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
            <rect x="30" y="235" width="14" height="20" fill="#374151" rx="3" />
          </g>
        )}

        {/* ─── Magnesium Ribbon ─────────────────────────────────────── */}
        <motion.g
          animate={{
            x: ribbonX - 100, // initial position is x=100; offset to reach ribbonX
            y: ribbonY - 235, // initial position is y=235; offset to reach ribbonY
          }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        >
          {/* The ribbon itself (a thin rectangular strip) */}
          <rect
            x="90"
            y="232"
            width="20"
            height="6"
            fill={ribbonFill}
            stroke={ribbonState === "dirty" ? "#6b7280" : "#9ca3af"}
            strokeWidth="0.5"
            rx="1"
          />
          {/* Shine on clean ribbon */}
          {ribbonState === "clean" && (
            <rect x="92" y="233" width="16" height="1.5" fill="#ffffff" opacity="0.7" rx="0.5" />
          )}
          {/* Dirty texture on uncleaned ribbon */}
          {ribbonState === "dirty" && (
            <>
              <circle cx="95" cy="234" r="0.6" fill="#6b7280" opacity="0.5" />
              <circle cx="103" cy="235" r="0.5" fill="#6b7280" opacity="0.5" />
              <circle cx="107" cy="234" r="0.4" fill="#6b7280" opacity="0.5" />
            </>
          )}
          {/* Ash texture on burned ribbon */}
          {ribbonState === "ash" && (
            <>
              <circle cx="93" cy="233" r="0.7" fill="#cbd5e1" />
              <circle cx="98" cy="234" r="0.6" fill="#e2e8f0" />
              <circle cx="104" cy="233" r="0.8" fill="#cbd5e1" />
              <circle cx="108" cy="234" r="0.5" fill="#e2e8f0" />
            </>
          )}
        </motion.g>

        {/* ─── Brilliant White Flame (when ribbon is burning) ──────── */}
        {ribbonState === "burning" && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ transformOrigin: `${ribbonX + 10}px ${ribbonY + 3}px` }}
          >
            {/* Outer radiating glow */}
            <motion.circle
              cx={ribbonX + 10}
              cy={ribbonY + 3}
              r="60"
              fill="url(#whiteGlow)"
              animate={{ r: [55, 70, 55], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
            {/* Intense white center */}
            <motion.circle
              cx={ribbonX + 10}
              cy={ribbonY + 3}
              r="14"
              fill="#ffffff"
              animate={{ r: [12, 16, 12] }}
              transition={{ duration: 0.2, repeat: Infinity }}
            />
            {/* Sparks */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.circle
                key={i}
                cx={ribbonX + 10}
                cy={ribbonY + 3}
                r="1.5"
                fill="#fef3c7"
                animate={{
                  cx: [ribbonX + 10, ribbonX + 10 + (Math.random() - 0.5) * 80],
                  cy: [ribbonY + 3, ribbonY - 30 - Math.random() * 20],
                  opacity: [1, 0],
                }}
                transition={{ duration: 1 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.g>
        )}

        {/* ─── Smoke wisps after burning ───────────────────────────── */}
        {ribbonState === "ash" && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 0] }} transition={{ duration: 2 }}>
            <ellipse cx={ribbonX + 10} cy={ribbonY - 10} rx="8" ry="3" fill="#cbd5e1" opacity="0.4" />
            <ellipse cx={ribbonX + 10} cy={ribbonY - 20} rx="12" ry="3" fill="#cbd5e1" opacity="0.3" />
          </motion.g>
        )}

        {/* ─── Labels (subtle, optional) ───────────────────────────── */}
        {phase === "clean" && ribbonState === "dirty" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            🧪 Magnesium ribbon (dull oxide coating)
          </text>
        )}
        {phase === "clean" && ribbonState === "clean" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            ✨ Magnesium ribbon (shiny silver — ready to ignite)
          </text>
        )}
        {phase === "observe" && ribbonState === "burning" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="bold" opacity="0.8">
            ⚠️ Dazzling white flame — DO NOT stare directly!
          </text>
        )}
        {phase === "observe" && ribbonState === "ash" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold" opacity="0.8">
            🌫️ White ash (MgO) remaining on the tongs
          </text>
        )}

        {/* ─── SVG Gradients ───────────────────────────────────────── */}
        <defs>
          <radialGradient id="whiteGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#fef3c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
          </radialGradient>
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
