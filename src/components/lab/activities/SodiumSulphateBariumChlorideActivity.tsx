"use client";

// ─── Activity 1.9 — Na₂SO₄ + BaCl₂ ───────────────────────────────────────────
// Equation: Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl  (heavy WHITE precipitate of BaSO₄)

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";
import { TwoSolutionMixScene, type TwoSolutionMixConfig } from "./TwoSolutionMixScene";

type Phase = "intro" | "add-sulphate" | "add-bacl2" | "observe" | "classify" | "results";
type ScenePhase = "empty" | "filled-a" | "pouring" | "done";

const TOTAL_STEPS = 4;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-sulphate": { title: "Add Sodium Sulphate Solution", instruction: "Take about 3 mL of SODIUM SULPHATE solution (Na₂SO₄ — CLEAR) in test tube A." },
  "add-bacl2":    { title: "Add Barium Chloride",          instruction: "Pour BARIUM CHLORIDE solution (BaCl₂) from test tube B into test tube A. Watch what happens immediately." },
  "observe":      { title: "Observe the White Precipitate", instruction: "A heavy WHITE precipitate of BARIUM SULPHATE (BaSO₄) forms immediately. No heat or light needed — just mixing." },
  "classify":     { title: "Classify the Reaction",         instruction: "Both reactants are ionic salts. They exchange ions (Ba²⁺ swaps partners with Na⁺). What type of reaction is this?" },
};

const OPTIONS = ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Double Displacement";
const EQUATION = "Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl";

const RECAP = [
  "When sodium sulphate (Na₂SO₄) and barium chloride (BaCl₂) solutions are mixed, the Ba²⁺ and SO₄²⁻ ions combine to form barium sulphate (BaSO₄), which is INSOLUBLE in water. The insoluble BaSO₄ comes out as a heavy white precipitate.",
  "Meanwhile, the Na⁺ and Cl⁻ ions remain in solution as sodium chloride (NaCl) — common salt, which is soluble. Both reactants exchange ions — the defining feature of a double displacement reaction.",
  "Barium sulphate is one of the most insoluble salts in water (Ksp ≈ 1.1 × 10⁻¹⁰). That is why even a trace of sulphate ion in solution can be detected by adding BaCl₂ — a white precipitate confirms SO₄²⁻.",
  "In medicine, BaSO₄ is used in 'barium meal' X-ray imaging of the digestive tract. Because BaSO₄ is insoluble, it is not absorbed by the body — it coats the stomach/intestine lining, making them visible on X-rays. (Soluble barium salts are highly toxic, so insolubility is what makes this safe.)",
  "Both Activity 1.8 (Pb(NO₃)₂ + KI → yellow PbI₂) and Activity 1.9 (Na₂SO₄ + BaCl₂ → white BaSO₄) are double displacement reactions driven by precipitate formation.",
];

const SAFETY_NOTES = [
  "Barium chloride is toxic if ingested — wash hands after handling.",
  "Avoid contact with skin and eyes.",
  "Do not pour waste solutions down the drain without dilution.",
];

const SCENE_CONFIG: TwoSolutionMixConfig = {
  labelA: "Sodium sulphate",
  formulaA: "Na₂SO₄",
  colorA: "rgba(219,234,254,0.7)",
  labelB: "Barium chloride",
  formulaB: "BaCl₂",
  colorB: "rgba(186,230,253,0.6)",
  precipitateColor: "#f8fafc",
  pouringDescription: "Pouring BaCl₂ into Na₂SO₄ — a heavy white solid is forming instantly!",
  finalDescription: "White precipitate of BaSO₄ has settled at the bottom of tube A. The clear liquid above contains dissolved NaCl.",
};

export function SodiumSulphateBariumChlorideActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [sulphateAdded, setSulphateAdded] = useState(false);
  const [bacl2Pouring, setBacl2Pouring] = useState(false);
  const [done, setDone] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const scenePhase: ScenePhase = !sulphateAdded ? "empty" : !bacl2Pouring ? "filled-a" : !done ? "pouring" : "done";

  const stepIndex =
    phase === "add-sulphate" ? 0 :
    phase === "add-bacl2" ? 1 :
    phase === "observe" ? 2 :
    phase === "classify" ? 3 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setSulphateAdded(false); setBacl2Pouring(false); setDone(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleSulphate = useCallback(() => {
    if (phase !== "add-sulphate" || sulphateAdded) return;
    setSulphateAdded(true);
    sfx.playPour();
    setObservation("CLEAR sodium sulphate (Na₂SO₄) solution added to test tube A.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, sulphateAdded]);

  const handleBacl2 = useCallback(() => {
    if (phase !== "add-bacl2" || bacl2Pouring) return;
    setBacl2Pouring(true);
    sfx.playPour();
    setPhase("observe");
    setObservation("⚪ Pouring BaCl₂ into Na₂SO₄ — a heavy WHITE precipitate forms IMMEDIATELY!");
    setObsVariant("success");
    setTimeout(() => {
      playReactionSound("precipitate");
      setDone(true);
      sfx.playSuccess();
      setObservation("✅ A heavy WHITE precipitate of BARIUM SULPHATE (BaSO₄) has settled at the bottom of tube A. The clear liquid above contains dissolved NaCl.");
      setShowContinue(true);
    }, 2000);
  }, [phase, bacl2Pouring]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-sulphate") setPhase("add-bacl2");
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
          emoji="⚪"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 1.9: Mix sodium sulphate solution and barium chloride solution. Observe the formation of a heavy white precipitate of barium sulphate (BaSO₄) — a double displacement reaction."
          steps={[
            { title: "Add Sodium Sulphate Solution", desc: "Take ~3 mL of clear Na₂SO₄ solution in test tube A." },
            { title: "Add Barium Chloride", desc: "Pour BaCl₂ solution from tube B into tube A." },
            { title: "Observe", desc: "A heavy white precipitate of BaSO₄ forms immediately." },
            { title: "Identify the Type", desc: "Two ionic salts exchange ions — what type of reaction is this?" },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-sulphate")}
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
      <ActivityHeader emoji="⚪" gradient={manifest.gradient} name={manifest.title} category="Chemical Reactions and Equations" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
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
          {phase === "add-sulphate" && (
            <ToolButton emoji="🧪" label="Na₂SO₄ Solution" onClick={handleSulphate} disabled={sulphateAdded} highlighted={!sulphateAdded} />
          )}
          {phase === "add-bacl2" && (
            <ToolButton emoji="🧴" label="Pour BaCl₂ Solution" onClick={handleBacl2} disabled={bacl2Pouring} highlighted={!bacl2Pouring} />
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
          <ActivityClassify question="What type of reaction is Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}
