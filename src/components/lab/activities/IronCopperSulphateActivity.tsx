"use client";

// ─── Activity 1.7 — Iron Nail in Copper Sulphate ─────────────────────────────
// Equation: Fe + CuSO₄ → FeSO₄ + Cu
// Scene: beaker with blue CuSO₄ + iron nail suspended by thread → blue fades to green + brown Cu deposit on nail

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type LiquidState = "blue" | "blue-green" | "green";
type Phase = "intro" | "add-cuso4" | "add-nail" | "observe" | "classify" | "results";

const TOTAL_STEPS = 4;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-cuso4": { title: "Add CuSO₄ Solution", instruction: "Pour COPPER SULPHATE solution (CuSO₄ — bright BLUE) into a clean beaker." },
  "add-nail":  { title: "Suspend the Iron Nail", instruction: "Tie a thread to a clean IRON NAIL (rubbed with sandpaper) and lower it into the CuSO₄ solution. Wait a few minutes for the reaction." },
  "observe":   { title: "Observe the Changes",  instruction: "Watch two changes: (1) the BLUE solution fades to PALE GREEN (FeSO₄), (2) a BROWN coating of COPPER deposits on the iron nail." },
  "classify":  { title: "Classify the Reaction", instruction: "Iron (more reactive) displaces copper (less reactive) from its salt. What type of reaction is this?" },
};

const OPTIONS = ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Displacement";
const EQUATION = "Fe + CuSO₄ → FeSO₄ + Cu";

const RECAP = [
  "Iron is ABOVE copper in the reactivity series, so iron can displace copper from copper sulphate solution. The products are iron(II) sulphate (FeSO₄ — pale green in solution) and copper metal (brown deposit on the nail).",
  "The colour change is the key clue: CuSO₄ solution is BLUE because of the Cu²⁺ ion, but FeSO₄ solution is PALE GREEN because of the Fe²⁺ ion. The change from blue to green tells you the ions in solution have swapped.",
  "The copper metal forms a thin brown coating on the iron nail because the displaced Cu atoms stick to the surface where the Fe atoms dissolved. Scraping the nail after some time reveals flakes of metallic copper.",
  "The reverse reaction (Cu + FeSO₄ → nothing) does NOT happen — copper is less reactive than iron and cannot displace it. This is the practical meaning of the reactivity series: a metal can only displace metals BELOW it.",
  "Other metals above copper (Zn, Mg, Al) would also displace Cu from CuSO₄, often faster than iron. Zinc gives a colourless solution (ZnSO₄); magnesium and aluminium also displace Cu vigorously.",
];

const SAFETY_NOTES = [
  "Copper sulphate is harmful if swallowed — wash hands after handling.",
  "Use a clean iron nail (rubbed with sandpaper) to remove any oxide/oil coating.",
  "Do not heat the solution — it speeds up the reaction but is unnecessary.",
];

export function IronCopperSulphateActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [liquidState, setLiquidState] = useState<LiquidState>("blue");
  const [cuso4Added, setCuso4Added] = useState(false);
  const [nailIn, setNailIn] = useState(false);
  const [cuDeposit, setCuDeposit] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-cuso4" ? 0 :
    phase === "add-nail" ? 1 :
    phase === "observe" ? 2 :
    phase === "classify" ? 3 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setLiquidState("blue"); setCuso4Added(false); setNailIn(false); setCuDeposit(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleCuso4 = useCallback(() => {
    if (phase !== "add-cuso4" || cuso4Added) return;
    setCuso4Added(true);
    sfx.playPour();
    setObservation("Bright BLUE copper sulphate (CuSO₄) solution poured into the beaker.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, cuso4Added]);

  const handleNail = useCallback(() => {
    if (phase !== "add-nail" || nailIn) return;
    setNailIn(true);
    sfx.playDrop();
    setPhase("observe");
    setObservation("The iron nail is suspended in the CuSO₄ solution. The displacement reaction begins — wait and watch…");
    setObsVariant("info");
    // Stage 1: blue → blue-green at ~1.5s, brown deposit starts
    setTimeout(() => {
      setLiquidState("blue-green");
      setCuDeposit(true);
      playReactionSound("color-change");
      setObservation("Stage 1: The BLUE solution is fading to BLUE-GREEN. A BROWN coating is starting to form on the iron nail.");
      setObsVariant("info");
    }, 1500);
    // Stage 2: blue-green → green at ~3.5s
    setTimeout(() => {
      setLiquidState("green");
      sfx.playSuccess();
      setObservation("✅ Stage 2: The solution is now PALE GREEN (FeSO₄). A distinct BROWN layer of COPPER coats the iron nail. The reaction is complete.");
      setObsVariant("success");
      setShowContinue(true);
    }, 3800);
  }, [phase, nailIn]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-cuso4") setPhase("add-nail");
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
          emoji="🔵"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 1.7: Dip an iron nail in copper sulphate solution. Observe the colour change (blue → green) and the brown copper deposit on the nail — a displacement reaction."
          steps={[
            { title: "Add CuSO₄ Solution", desc: "Pour bright blue copper sulphate solution into a clean beaker." },
            { title: "Suspend the Iron Nail", desc: "Tie a thread to a clean iron nail and lower it into the solution." },
            { title: "Observe", desc: "After 10-15 min: blue solution fades to pale green (FeSO₄), brown Cu deposits on the nail." },
            { title: "Compare with the Reverse", desc: "Copper wire in FeSO₄ does nothing — copper cannot displace iron." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-cuso4")}
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
      <ActivityHeader emoji="🔵" gradient={manifest.gradient} name={manifest.title} category="Chemical Reactions and Equations" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <IronCopperSulphateScene liquidState={liquidState} cuso4Added={cuso4Added} nailIn={nailIn} cuDeposit={cuDeposit} phase={phase} />
        <AnimatePresence mode="wait">
          {observation && (
            <motion.div key={observation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <ObservationBanner text={observation} variant={obsVariant} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3 flex-wrap justify-center">
          {phase === "add-cuso4" && (
            <ToolButton emoji="🔵" label="CuSO₄ Solution" onClick={handleCuso4} disabled={cuso4Added} highlighted={!cuso4Added} />
          )}
          {phase === "add-nail" && (
            <ToolButton emoji="🔩" label="Iron Nail + Thread" onClick={handleNail} disabled={nailIn} highlighted={!nailIn} />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watching the displacement reaction…</div>
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="What type of reaction is Fe + CuSO₄ → FeSO₄ + Cu?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function IronCopperSulphateScene({
  liquidState, cuso4Added, nailIn, cuDeposit, phase,
}: {
  liquidState: LiquidState; cuso4Added: boolean; nailIn: boolean; cuDeposit: boolean; phase: Phase;
}) {
  const liquidColor =
    liquidState === "blue" ? "rgba(37,99,235,0.65)" :
    liquidState === "blue-green" ? "rgba(20,184,166,0.55)" :
    "rgba(34,197,94,0.55)"; // pale green FeSO₄

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Beaker (centered at x=200) */}
        <g>
          {/* Liquid */}
          {cuso4Added && (
            <motion.path
              d="M 155 230 L 245 230 L 245 160 L 155 160 Z"
              fill={liquidColor}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1, fill: liquidColor }}
              style={{ transformOrigin: "200px 230px" }}
            />
          )}
          {/* Liquid surface */}
          {cuso4Added && (
            <motion.ellipse cx="200" cy="160" rx="45" ry="3" fill={liquidColor} animate={{ fill: liquidColor }} />
          )}
          {/* Beaker outline */}
          <path d="M 150 230 L 250 230 L 250 140 L 150 140 Z" fill="none" stroke="#475569" strokeWidth="2.5" />
          <path d="M 150 140 Q 145 137 140 140" fill="none" stroke="#475569" strokeWidth="2.5" />
          <path d="M 250 140 Q 255 137 260 140" fill="none" stroke="#475569" strokeWidth="2.5" />
          {/* Glass shine */}
          <line x1="155" y1="225" x2="155" y2="150" stroke="#ffffff" strokeWidth="2" opacity="0.4" />

          {/* Iron nail (suspended by thread) */}
          {nailIn && (
            <motion.g
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
            >
              {/* Thread coming from top */}
              <line x1="200" y1="0" x2="200" y2="155" stroke="#92400e" strokeWidth="1.2" strokeDasharray="2,1" />
              {/* Nail head */}
              <circle cx="200" cy="200" r="5" fill={cuDeposit ? "#7c2d12" : "#6b7280"} stroke="#1f2937" strokeWidth="0.5" />
              {/* Nail shaft (vertical) */}
              <rect x="197" y="170" width="6" height="35" fill={cuDeposit ? "#7c2d12" : "#6b7280"} stroke="#1f2937" strokeWidth="0.5" rx="1" />
              {/* Nail tip (pointed) */}
              <path d="M 197 205 L 203 205 L 200 213 Z" fill={cuDeposit ? "#7c2d12" : "#6b7280"} stroke="#1f2937" strokeWidth="0.5" />
              {/* Copper deposit spots (brown) */}
              {cuDeposit && (
                <>
                  <motion.circle cx="195" cy="180" r="1.5" fill="#b91c1c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
                  <motion.circle cx="204" cy="185" r="1.8" fill="#b91c1c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
                  <motion.circle cx="194" cy="195" r="1.5" fill="#b91c1c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
                  <motion.circle cx="205" cy="198" r="1.6" fill="#b91c1c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
                  <motion.circle cx="199" cy="205" r="1.5" fill="#b91c1c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} />
                </>
              )}
            </motion.g>
          )}
        </g>

        {/* Labels */}
        {phase === "add-cuso4" && !cuso4Added && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty beaker — pour in CuSO₄ solution
          </text>
        )}
        {phase === "add-nail" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Blue CuSO₄ solution ready — suspend the iron nail
          </text>
        )}
        {phase === "observe" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            {liquidState === "blue" ? "Watching…" : liquidState === "blue-green" ? "Stage 1: Blue → Blue-green + brown deposit" : "Stage 2: Solution pale green + thick brown Cu coating"}
          </text>
        )}
      </svg>
    </div>
  );
}
