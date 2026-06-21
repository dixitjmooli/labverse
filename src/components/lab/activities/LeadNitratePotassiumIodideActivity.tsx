"use client";

// ─── Activity 1.8 — Pb(NO₃)₂ + KI ────────────────────────────────────────────
// Equation: Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃  (bright YELLOW precipitate of PbI₂)

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";
import { TwoSolutionMixScene, type TwoSolutionMixConfig } from "./TwoSolutionMixScene";

type Phase = "intro" | "add-lead" | "add-ki" | "observe" | "classify" | "results";
type ScenePhase = "empty" | "filled-a" | "pouring" | "done";

const TOTAL_STEPS = 4;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-lead": { title: "Add Lead Nitrate Solution", instruction: "Take about 3 mL of LEAD NITRATE solution [Pb(NO₃)₂ — CLEAR] in test tube A." },
  "add-ki":   { title: "Add Potassium Iodide",     instruction: "Pour POTASSIUM IODIDE solution (KI) from test tube B into test tube A. Watch what happens immediately." },
  "observe":  { title: "Observe the Yellow Precipitate", instruction: "A bright YELLOW precipitate of LEAD IODIDE (PbI₂) forms immediately. No heat or light needed — just mixing." },
  "classify": { title: "Classify the Reaction",    instruction: "Both reactants are ionic salts. They exchange ions (Pb²⁺ swaps partners with K⁺). What type of reaction is this?" },
};

const OPTIONS = ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Double Displacement";
const EQUATION = "Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃";

const RECAP = [
  "When lead nitrate [Pb(NO₃)₂] and potassium iodide (KI) solutions are mixed, the Pb²⁺ and I⁻ ions combine to form lead iodide (PbI₂), which is INSOLUBLE in water. The insoluble PbI₂ comes out as a bright yellow precipitate.",
  "Meanwhile, the K⁺ and NO₃⁻ ions remain in solution as potassium nitrate (KNO₃), which is soluble. Both salts exchange ions — that is the defining feature of a double displacement reaction.",
  "The 'Golden Rain' demonstration uses this same reaction: PbI₂ is dissolved in hot water (more soluble hot) and allowed to cool slowly. As it cools, glittering golden crystals of PbI₂ recrystallise — looking like falling golden rain.",
  "Lead iodide is one of the few bright YELLOW precipitates in inorganic chemistry. This makes the Pb²⁺ + I⁻ test a confirmatory test for both ions: yellow precipitate = both lead and iodide are present.",
  "A double displacement reaction is driven forward by any of three things: (1) formation of a precipitate (insoluble solid), (2) evolution of a gas, or (3) formation of a molecular compound like water. If none of these happens, no reaction occurs.",
];

const SAFETY_NOTES = [
  "Lead compounds are toxic — wash hands after handling.",
  "Avoid contact with skin and eyes.",
  "Do not ingest any of the solutions.",
];

const SCENE_CONFIG: TwoSolutionMixConfig = {
  labelA: "Lead nitrate",
  formulaA: "Pb(NO₃)₂",
  colorA: "rgba(219,234,254,0.7)",
  labelB: "Potassium iodide",
  formulaB: "KI",
  colorB: "rgba(167,243,208,0.6)",
  precipitateColor: "#facc15",
  pouringDescription: "Pouring KI into Pb(NO₃)₂ — a bright yellow solid is forming instantly!",
  finalDescription: "Yellow precipitate of PbI₂ has settled at the bottom of tube A. The clear liquid above contains dissolved KNO₃.",
};

export function LeadNitratePotassiumIodideActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [leadAdded, setLeadAdded] = useState(false);
  const [kiPouring, setKiPouring] = useState(false);
  const [done, setDone] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const scenePhase: ScenePhase = !leadAdded ? "empty" : !kiPouring ? "filled-a" : !done ? "pouring" : "done";

  const stepIndex =
    phase === "add-lead" ? 0 :
    phase === "add-ki" ? 1 :
    phase === "observe" ? 2 :
    phase === "classify" ? 3 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setLeadAdded(false); setKiPouring(false); setDone(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleLead = useCallback(() => {
    if (phase !== "add-lead" || leadAdded) return;
    setLeadAdded(true);
    sfx.playPour();
    setObservation("CLEAR lead nitrate [Pb(NO₃)₂] solution added to test tube A.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, leadAdded]);

  const handleKi = useCallback(() => {
    if (phase !== "add-ki" || kiPouring) return;
    setKiPouring(true);
    sfx.playPour();
    setPhase("observe");
    setObservation("🟡 Pouring KI into Pb(NO₃)₂ — a bright YELLOW precipitate forms IMMEDIATELY!");
    setObsVariant("success");
    setTimeout(() => {
      playReactionSound("precipitate");
      setDone(true);
      sfx.playSuccess();
      setObservation("✅ A bright YELLOW precipitate of LEAD IODIDE (PbI₂) has settled at the bottom of tube A. The clear liquid above contains dissolved KNO₃.");
      setShowContinue(true);
    }, 2000);
  }, [phase, kiPouring]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-lead") setPhase("add-ki");
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
          emoji="🟡"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 1.8: Mix lead nitrate solution and potassium iodide solution. Observe the formation of a bright yellow precipitate of lead iodide (PbI₂) — a double displacement reaction."
          steps={[
            { title: "Add Lead Nitrate Solution", desc: "Take ~3 mL of clear Pb(NO₃)₂ solution in test tube A." },
            { title: "Add Potassium Iodide", desc: "Pour KI solution from tube B into tube A." },
            { title: "Observe", desc: "A bright yellow precipitate of PbI₂ forms immediately." },
            { title: "Identify the Type", desc: "Two ionic salts exchange ions — what type of reaction is this?" },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-lead")}
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
      <ActivityHeader emoji="🟡" gradient={manifest.gradient} name={manifest.title} category="Chemical Reactions and Equations" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <TwoSolutionMixScene phase={scenePhase} config={SCENE_CONFIG} />
        <AnimatePresence mode="wait">
          {observation && (
            <motion.div key={observation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <ObservationBanner text={observation} variant={obsVariant} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3 flex-wrap justify-center">
          {phase === "add-lead" && (
            <ToolButton emoji="🧪" label="Pb(NO₃)₂ Solution" onClick={handleLead} disabled={leadAdded} highlighted={!leadAdded} />
          )}
          {phase === "add-ki" && (
            <ToolButton emoji="🧴" label="Pour KI Solution" onClick={handleKi} disabled={kiPouring} highlighted={!kiPouring} />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watching the precipitate form…</div>
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="What type of reaction is Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}
