"use client";

// ─── Activity 2.4 — Base + Metal (amphoteric) → Salt + H₂ ────────────────────
// NCERT Class 10 · Science · Chapter 2 · Activity 2.4
//
// Reaction: 2NaOH + Zn → Na₂ZnO₂ + H₂↑   (sodium zincate + hydrogen)
//
// Scene: Test tube with NaOH solution; drop in zinc granules; heat gently.
// H₂ evolves; bring burning matchstick to mouth → 'POP' confirms H₂.
// Key teaching point: not all metals react with bases — only amphoteric ones (Zn, Al, Pb, Sn).

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type Phase = "intro" | "add-naoh" | "drop-zinc" | "heat" | "pop-test" | "classify" | "results";

const TOTAL_STEPS = 5;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-naoh":  { title: "Add NaOH Solution",      instruction: "Take about 5 mL of SODIUM HYDROXIDE (NaOH) solution in a test tube. NaOH is a strong base." },
  "drop-zinc": { title: "Add Zinc Granules",       instruction: "Add a few ZINC GRANULES to the NaOH solution. Initially, nothing happens at room temperature." },
  "heat":      { title: "Heat Gently",              instruction: "Warm the test tube gently over a burner. H₂ gas starts evolving from the zinc surface." },
  "pop-test":  { title: "Test for H₂",              instruction: "Bring a BURNING matchstick to the tube mouth. A 'POP' confirms H₂ — even bases can release H₂ with amphoteric metals!" },
  "classify":  { title: "Conclude",                 instruction: "Zn + NaOH (base) → Na₂ZnO₂ + H₂. This is a displacement reaction. Note: Zn is amphoteric — most metals do NOT react with bases." },
};

const OPTIONS = ["Displacement", "Combination", "Decomposition", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Displacement";
const EQUATION = "2NaOH + Zn → Na₂ZnO₂ + H₂↑   (sodium zincate + hydrogen)";

const RECAP = [
  "Some metals — called AMPHOTERIC metals — react with strong bases to release H₂. The general equation: Base + Amphoteric Metal → Salt + H₂↑. Zinc, aluminium, lead, and tin are amphoteric; most other metals (Cu, Fe, Mg, Na, etc.) do NOT react with bases.",
  "When Zn is added to NaOH solution and warmed, the reaction produces SODIUM ZINCATE (Na₂ZnO₂) — which stays dissolved — and HYDROGEN gas, which escapes as bubbles: 2NaOH + Zn → Na₂ZnO₂ + H₂↑.",
  "At room temperature, the reaction is very slow. Warming the mixture speeds it up — that's why the activity calls for gentle heating. Without heat, you might wait a long time before seeing bubbles.",
  "The 'POP' test confirms the gas is H₂ — the same test used in Activity 1.2 (Zn + HCl) and Activity 2.3 (Mg/Zn/Fe + HCl). A lighted matchstick at the tube mouth makes H₂ burn with a characteristic pop.",
  "Why doesn't iron or copper react with NaOH? Because they're not amphoteric — they don't form stable zincate/aluminate-type salts. This selectivity is useful in qualitative analysis: NaOH can be used to separate Zn/Al from a mixture of metals.",
  "Practical application: the reaction of Al with NaOH is used to generate H₂ in some chemical hydrogen generators. The aluminate (NaAlO₂) byproduct is used in water treatment as a flocculating agent.",
];

const SAFETY_NOTES = [
  "NaOH is CAUSTIC — wear goggles, avoid skin contact.",
  "Heat GENTLY — strong heating can cause bumping and splattering of caustic NaOH.",
  "Keep the tube mouth away from your face during the pop test.",
];

export function BaseMetalHydrogenActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [naohAdded, setNaohAdded] = useState(false);
  const [zincDropped, setZincDropped] = useState(false);
  const [burnerOn, setBurnerOn] = useState(false);
  const [bubbling, setBubbling] = useState(false);
  const [popped, setPopped] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-naoh" ? 0 :
    phase === "drop-zinc" ? 1 :
    phase === "heat" ? 2 :
    phase === "pop-test" ? 3 :
    phase === "classify" ? 4 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setNaohAdded(false); setZincDropped(false); setBurnerOn(false);
    setBubbling(false); setPopped(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleNaoh = useCallback(() => {
    if (phase !== "add-naoh" || naohAdded) return;
    setNaohAdded(true);
    sfx.playPour();
    setObservation("Sodium hydroxide (NaOH) solution added to the test tube — clear, colourless, CAUSTIC.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, naohAdded]);

  const handleZinc = useCallback(() => {
    if (phase !== "drop-zinc" || zincDropped) return;
    setZincDropped(true);
    sfx.playDrop();
    setObservation("Zinc granules added. At room temperature nothing happens — you'll need to warm the tube gently.");
    setObsVariant("info");
    setShowContinue(true);
  }, [phase, zincDropped]);

  const handleHeat = useCallback(() => {
    if (phase !== "heat" || burnerOn) return;
    setBurnerOn(true);
    sfx.playPour();
    setTimeout(() => {
      setBubbling(true);
      playReactionSound("effervescence");
      setObservation("🫧 On warming, brisk effervescence starts on the zinc surface! H₂ gas is being released — Zn is amphoteric and reacts with NaOH.");
      setObsVariant("success");
      setTimeout(() => setShowContinue(true), 2500);
    }, 1500);
  }, [phase, burnerOn]);

  const handlePop = useCallback(() => {
    if (phase !== "pop-test" || popped) return;
    setPopped(true);
    sfx.playError();
    setTimeout(() => {
      sfx.playSuccess();
      setObservation("💥 'POP!' The burning matchstick at the tube mouth makes a sharp pop. This confirms the gas is HYDROGEN (H₂) — even a BASE can release H₂ with an amphoteric metal.");
      setObsVariant("success");
      setShowContinue(true);
    }, 600);
  }, [phase, popped]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-naoh") setPhase("drop-zinc");
    else if (phase === "drop-zinc") setPhase("heat");
    else if (phase === "heat") setPhase("pop-test");
    else if (phase === "pop-test") setPhase("classify");
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
          emoji="🧪"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 2.4: Add zinc granules to NaOH solution and warm gently. H₂ gas evolves — proving that strong bases can also release H₂ with AMPHOTERIC metals (Zn, Al, Pb, Sn)."
          steps={[
            { title: "Add NaOH Solution", desc: "Take ~5 mL of NaOH in a test tube (caustic — handle with care)." },
            { title: "Add Zinc Granules", desc: "Drop in a few Zn granules. Nothing happens at room temperature." },
            { title: "Heat Gently", desc: "Warm the tube. Brisk effervescence of H₂ starts on the zinc." },
            { title: "Pop Test", desc: "Burning matchstick at mouth → 'POP' confirms H₂." },
            { title: "Conclude", desc: "Zn is amphoteric — most metals don't react with bases." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-naoh")}
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
      <ActivityHeader emoji="🧪" gradient={manifest.gradient} name={manifest.title} category="Acids, Bases and Salts" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <BaseMetalScene
          naohAdded={naohAdded}
          zincDropped={zincDropped}
          burnerOn={burnerOn}
          bubbling={bubbling}
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
          {phase === "add-naoh" && (
            <ToolButton emoji="🧴" label="Add NaOH Solution" onClick={handleNaoh} disabled={naohAdded} highlighted={!naohAdded} />
          )}
          {phase === "drop-zinc" && (
            <ToolButton emoji="⚪" label="Add Zinc Granules" onClick={handleZinc} disabled={zincDropped} highlighted={!zincDropped} />
          )}
          {phase === "heat" && (
            <ToolButton emoji="🔥" label="Ignite Burner" onClick={handleHeat} disabled={burnerOn} highlighted={!burnerOn} />
          )}
          {phase === "pop-test" && (
            <ToolButton emoji="💥" label="Pop Test" onClick={handlePop} disabled={popped} highlighted={!popped} />
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="2NaOH + Zn → Na₂ZnO₂ + H₂. What type of reaction is this?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function BaseMetalScene({
  naohAdded, zincDropped, burnerOn, bubbling, popped, phase,
}: {
  naohAdded: boolean; zincDropped: boolean; burnerOn: boolean; bubbling: boolean; popped: boolean; phase: Phase;
}) {
  // Tube at x=180-220; burner at x=200, base y=240
  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Bunsen burner */}
        <ellipse cx="200" cy="240" rx="22" ry="4" fill="#1f2937" />
        <rect x="190" y="225" width="20" height="18" fill="#374151" rx="2" />
        <rect x="196" y="200" width="8" height="30" fill="#4b5563" rx="1" />
        <rect x="193" y="192" width="14" height="10" fill="#1f2937" rx="1" />

        {/* Burner flame */}
        {burnerOn && (
          <motion.g initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} style={{ transformOrigin: "200px 195px" }}>
            <motion.path d="M 200 195 Q 192 175 196 155 Q 200 145 204 155 Q 208 175 200 195 Z" fill="url(#flameOuter)" animate={{ d: ["M 200 195 Q 192 175 196 155 Q 200 145 204 155 Q 208 175 200 195 Z", "M 200 195 Q 190 175 195 152 Q 200 142 205 152 Q 210 175 200 195 Z", "M 200 195 Q 192 175 196 155 Q 200 145 204 155 Q 208 175 200 195 Z"], transition: { duration: 0.4, repeat: Infinity } }} />
            <path d="M 200 195 Q 197 185 198 170 Q 200 162 202 170 Q 203 185 200 195 Z" fill="url(#flameInner)" />
          </motion.g>
        )}

        {/* Test tube (vertical, mouth up) */}
        <g>
          {/* NaOH liquid */}
          {naohAdded && (
            <rect x="184" y="170" width="32" height="55" fill="rgba(186,230,253,0.5)" />
          )}
          {naohAdded && (
            <ellipse cx="200" cy="170" rx="16" ry="2" fill="rgba(186,230,253,0.5)" />
          )}
          {/* Tube outline */}
          <path d="M 184 130 L 216 130 L 216 220 Q 216 226 210 226 L 190 226 Q 184 226 184 220 Z" fill="rgba(255,255,255,0.1)" stroke="#475569" strokeWidth="2" />
          <rect x="180" y="126" width="40" height="6" fill="none" stroke="#475569" strokeWidth="2" rx="1" />
          <line x1="188" y1="218" x2="188" y2="135" stroke="#ffffff" strokeWidth="1.2" opacity="0.4" />

          {/* Zinc granules at bottom */}
          {zincDropped && (
            <>
              <circle cx="190" cy="220" r="2.5" fill="#9ca3af" stroke="#475569" strokeWidth="0.3" />
              <circle cx="198" cy="222" r="3" fill="#9ca3af" stroke="#475569" strokeWidth="0.3" />
              <circle cx="207" cy="220" r="2.5" fill="#9ca3af" stroke="#475569" strokeWidth="0.3" />
              <circle cx="195" cy="217" r="2" fill="#cbd5e1" stroke="#475569" strokeWidth="0.3" />
              <circle cx="203" cy="217" r="2" fill="#cbd5e1" stroke="#475569" strokeWidth="0.3" />
            </>
          )}

          {/* Bubbles (when bubbling) */}
          {bubbling && [0, 1, 2, 3, 4].map((i) => (
            <motion.circle
              key={i}
              cx={188 + (i * 5)}
              cy={218}
              r={1.5 + (i % 2)}
              fill="#ffffff"
              opacity={0.85}
              animate={{
                cy: [218, 170],
                opacity: [0.9, 0.9, 0],
                r: [1.5 + (i % 2), 2.5 + (i % 2)],
              }}
              transition={{ duration: 1.2 + (i * 0.1), repeat: Infinity, delay: i * 0.18, ease: "easeOut" }}
            />
          ))}
        </g>

        {/* Pop test */}
        {phase === "pop-test" && (
          <motion.g
            animate={{ y: popped ? 25 : 0, x: popped ? 0 : -90 }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
          >
            <rect x="278" y="80" width="4" height="35" fill="#d4a574" rx="1" />
            <ellipse cx="280" cy="78" rx="3" ry="4" fill={popped ? "#f97316" : "#7c2d12"} />
            {popped && (
              <motion.g
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2, 2.5], opacity: [1, 0.8, 0] }}
                transition={{ duration: 0.8 }}
                style={{ transformOrigin: "280px 78px" }}
              >
                <circle cx="280" cy="78" r="10" fill="#fef3c7" opacity="0.9" />
                <text x="280" y="82" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#dc2626">POP!</text>
              </motion.g>
            )}
          </motion.g>
        )}

        {/* Top label */}
        {phase === "add-naoh" && !naohAdded && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty test tube — add NaOH solution
          </text>
        )}
        {phase === "drop-zinc" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            NaOH in tube — add zinc granules
          </text>
        )}
        {phase === "heat" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Zinc in NaOH — heat gently to start the reaction
          </text>
        )}
        {phase === "pop-test" && !popped && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="bold" opacity="0.8">
            💥 Bring a burning matchstick to the tube mouth
          </text>
        )}
        {phase === "classify" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            ✅ H₂ released — Zn is amphoteric
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
