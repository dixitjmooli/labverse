"use client";

// ─── Activity 2.10 — Plaster of Paris (gypsum → PoP → gypsum) ────────────────
// NCERT Class 10 · Science · Chapter 2 · Activity 2.10
//
// Reactions:
//   1) CaSO₄·2H₂O (gypsum) →heat→ CaSO₄·½H₂O (Plaster of Paris) + 1½ H₂O
//      (carefully controlled heating at 373 K / 100°C — too much heat gives 'dead burnt plaster')
//   2) CaSO₄·½H₂O (PoP) + 1½ H₂O → CaSO₄·2H₂O (gypsum)  (setting of Plaster of Paris)
//
// Scene: Two stages — first heat gypsum in a crucible to get PoP; then add water to PoP to set it back to gypsum (hard mass).

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type PowderState = "gypsum" | "transitioning" | "pop" | "setting" | "set-gypsum";
type Phase = "intro" | "add-gypsum" | "heat" | "observe-pop" | "add-water" | "observe-set" | "classify" | "results";

const TOTAL_STEPS = 6;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-gypsum":   { title: "Add Gypsum",                       instruction: "Take GYPSUM powder (CaSO₄·2H₂O — white) in a crucible." },
  "heat":         { title: "Heat at 373 K (100°C)",            instruction: "Heat the crucible GENTLY at exactly 373 K (100°C). Too hot → 'dead burnt plaster' (won't set)." },
  "observe-pop":  { title: "Observe Plaster of Paris",          instruction: "The gypsum has lost 1½ molecules of water and become PLASTER OF PARIS (CaSO₄·½H₂O). Still white, but chemically different." },
  "add-water":    { title: "Add Water to PoP",                  instruction: "Add water to the Plaster of Paris powder and stir. The setting reaction begins immediately." },
  "observe-set":  { title: "Observe the Setting",               instruction: "Within minutes, the wet paste HARDENS into a solid mass — gypsum again. The PoP has set. This is why it's used in casts and moulds." },
  "classify":     { title: "Conclude",                          instruction: "Gypsum ⇌ Plaster of Paris + 1½ H₂O. Heating drives off water; adding water brings it back. What type of reaction?" },
};

const OPTIONS = ["Reversible Decomposition", "Combination", "Displacement", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Reversible Decomposition";
const EQUATION = "CaSO₄·2H₂O (gypsum) ⇌ CaSO₄·½H₂O (PoP) + 1½ H₂O";

const RECAP = [
  "Plaster of Paris (PoP) is made by heating GYPSUM (CaSO₄·2H₂O) at exactly 373 K (100°C). The reaction: CaSO₄·2H₂O → CaSO₄·½H₂O + 1½ H₂O. The product, calcium sulphate hemihydrate (CaSO₄·½H₂O), is Plaster of Paris.",
  "The temperature must be controlled PRECISELY at 373 K. If heated too strongly, gypsum forms 'DEAD BURNT PLASTER' (anhydrous CaSO₄) which CANNOT set with water — it's chemically dead for this purpose. This is why the heating is gentle and carefully controlled.",
  "When water is added to PoP, the reverse reaction happens: CaSO₄·½H₂O + 1½ H₂O → CaSO₄·2H₂O. The powder first forms a wet paste, then hardens into a solid mass of gypsum within 15-30 minutes. This is called the SETTING of Plaster of Paris.",
  "The setting reaction is EXOTHERMIC — heat is released as the gypsum crystal structure reforms. The mass becomes warm to the touch and expands slightly, taking the shape of the mould. This expansion is what makes PoP so useful for casting — it picks up fine detail.",
  "PoP gets its name from the large gypsum deposits mined at MONTMARTRE in Paris, where it was first produced commercially in the 1700s. It is widely used in: (1) orthopaedic CASTS for broken bones, (2) sculpting and statues, (3) making moulds for pottery and metal casting, (4) wall plaster and false ceilings, (5) dentistry for dental impressions.",
  "Compare with Activity 2.9: copper sulphate also loses water of crystallisation on heating, but CuSO₄·5H₂O → CuSO₄ + 5H₂O loses ALL 5 waters, while gypsum → PoP loses only 1½ of its 2 waters. The 'half-water' compound (hemihydrate) is the magic of PoP — losing all water would give anhydrous CaSO₄ (dead burnt plaster, won't set).",
];

const SAFETY_NOTES = [
  "Heat at 373 K (100°C) — NOT higher. Too hot ruins the product.",
  "The setting reaction is exothermic — don't touch the setting PoP with bare hands.",
  "Avoid inhaling PoP dust — it can irritate the lungs.",
];

export function PlasterOfParisActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [powderState, setPowderState] = useState<PowderState>("gypsum");
  const [gypsumAdded, setGypsumAdded] = useState(false);
  const [burnerOn, setBurnerOn] = useState(false);
  const [steam, setSteam] = useState(false);
  const [waterAdded, setWaterAdded] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-gypsum" ? 0 :
    phase === "heat" ? 1 :
    phase === "observe-pop" ? 2 :
    phase === "add-water" ? 3 :
    phase === "observe-set" ? 4 :
    phase === "classify" ? 5 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setPowderState("gypsum"); setGypsumAdded(false); setBurnerOn(false);
    setSteam(false); setWaterAdded(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleGypsum = useCallback(() => {
    if (phase !== "add-gypsum" || gypsumAdded) return;
    setGypsumAdded(true);
    sfx.playDrop();
    setObservation("White GYPSUM powder (CaSO₄·2H₂O) added to the crucible.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, gypsumAdded]);

  const handleHeat = useCallback(() => {
    if (phase !== "heat" || burnerOn) return;
    setBurnerOn(true);
    sfx.playPour();
    setTimeout(() => {
      setSteam(true);
      setPowderState("transitioning");
      setObservation("💨 Steam rises — 1½ molecules of water are being driven off from each gypsum unit.");
      setObsVariant("info");
    }, 1500);
    setTimeout(() => {
      setPowderState("pop");
      setSteam(false);
      sfx.playSuccess();
      setPhase("observe-pop");
      setObservation("✅ Gypsum has become PLASTER OF PARIS (CaSO₄·½H₂O). Still white, but now it can SET when water is added — the key property of PoP.");
      setObsVariant("success");
      setShowContinue(true);
    }, 4000);
  }, [phase, burnerOn]);

  const handleWater = useCallback(() => {
    if (phase !== "add-water" || waterAdded) return;
    setWaterAdded(true);
    sfx.playPour();
    setPhase("observe-set");
    setObservation("💧 Adding water to PoP — a paste forms. The setting reaction begins immediately…");
    setObsVariant("info");
    setTimeout(() => {
      setPowderState("setting");
      playReactionSound("color-change");
      setObservation("🔄 The paste is HARDENING. The hemihydrate is rehydrating back to gypsum. Heat is released (exothermic).");
      setObsVariant("success");
    }, 2000);
    setTimeout(() => {
      setPowderState("set-gypsum");
      sfx.playSuccess();
      setObservation("✅ The paste has SET into a HARD SOLID mass — gypsum again! Plaster of Paris is now a solid cast. This is why it's used in orthopaedic casts and moulds.");
      setObsVariant("success");
      setShowContinue(true);
    }, 5000);
  }, [phase, waterAdded]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-gypsum") setPhase("heat");
    else if (phase === "observe-pop") setPhase("add-water");
    else if (phase === "observe-set") setPhase("classify");
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
          emoji="🪨"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 2.10: Heat gypsum (CaSO₄·2H₂O) at 373 K to make Plaster of Paris (CaSO₄·½H₂O). Then add water to PoP — it sets back to gypsum, forming a hard solid. This reversible reaction is the basis of orthopaedic casts and sculpting."
          steps={[
            { title: "Add Gypsum", desc: "CaSO₄·2H₂O (white powder) in a crucible." },
            { title: "Heat at 373 K", desc: "Carefully controlled — too hot gives 'dead burnt plaster'." },
            { title: "Get Plaster of Paris", desc: "CaSO₄·½H₂O — hemihydrate, can set with water." },
            { title: "Add Water to PoP", desc: "Paste forms and begins to harden." },
            { title: "Observe Setting", desc: "PoP hardens into solid gypsum — exothermic." },
            { title: "Conclude", desc: "Gypsum ⇌ PoP + 1½ H₂O — reversible decomposition." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-gypsum")}
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
      <ActivityHeader emoji="🪨" gradient={manifest.gradient} name={manifest.title} category="Acids, Bases and Salts" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <PlasterOfParisScene powderState={powderState} gypsumAdded={gypsumAdded} burnerOn={burnerOn} steam={steam} waterAdded={waterAdded} phase={phase} />
        <AnimatePresence mode="wait">
          {observation && (
            <motion.div key={observation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <ObservationBanner text={observation} variant={obsVariant} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-3 flex-wrap justify-center">
          {phase === "add-gypsum" && (
            <ToolButton emoji="⚪" label="Add Gypsum" onClick={handleGypsum} disabled={gypsumAdded} highlighted={!gypsumAdded} />
          )}
          {phase === "heat" && (
            <ToolButton emoji="🔥" label="Heat at 373 K" onClick={handleHeat} disabled={burnerOn} highlighted={!burnerOn} />
          )}
          {phase === "observe-pop" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Plaster of Paris formed…</div>
          )}
          {phase === "add-water" && (
            <ToolButton emoji="💧" label="Add Water to PoP" onClick={handleWater} disabled={waterAdded} highlighted={!waterAdded} />
          )}
          {phase === "observe-set" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watching the paste harden…</div>
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="CaSO₄·2H₂O ⇌ CaSO₄·½H₂O + 1½ H₂O. What type of reaction is this?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

function PlasterOfParisScene({
  powderState, gypsumAdded, burnerOn, steam, waterAdded, phase,
}: {
  powderState: PowderState; gypsumAdded: boolean; burnerOn: boolean;
  steam: boolean; waterAdded: boolean; phase: Phase;
}) {
  // Powder color: white throughout, but texture/state changes
  // Use a slightly different shade for "set" (more solid grey-white)
  const powderColor = powderState === "set-gypsum" ? "#e2e8f0" : "#f8fafc";
  const isPaste = powderState === "setting";
  const isSolid = powderState === "set-gypsum";

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* Tripod stand (holding crucible) */}
        <line x1="155" y1="240" x2="200" y2="220" stroke="#1f2937" strokeWidth="3" />
        <line x1="200" y1="220" x2="245" y2="240" stroke="#1f2937" strokeWidth="3" />
        <line x1="200" y1="220" x2="200" y2="240" stroke="#1f2937" strokeWidth="3" />

        {/* Crucible (small bowl, centered at x=200, y=190-220) */}
        <g>
          {/* Crucible body */}
          <path d="M 175 190 L 225 190 L 220 220 L 180 220 Z" fill="#374151" stroke="#1f2937" strokeWidth="2" />
          {/* Crucible rim */}
          <ellipse cx="200" cy="190" rx="25" ry="3" fill="#1f2937" />

          {/* Powder inside crucible */}
          {gypsumAdded && (
            <motion.g>
              {/* Powder pile (or paste, or solid block) */}
              {isSolid ? (
                // Solid block when set
                <motion.rect
                  x="180" y="200" width="40" height="18"
                  fill={powderColor}
                  stroke="#9ca3af" strokeWidth="0.5"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  rx="1"
                />
              ) : isPaste ? (
                // Wet paste
                <motion.path
                  d="M 180 218 Q 200 205 220 218 L 220 220 L 180 220 Z"
                  fill="#cbd5e1"
                  animate={{ d: ["M 180 218 Q 200 205 220 218 L 220 220 L 180 220 Z", "M 180 218 Q 200 208 220 218 L 220 220 L 180 220 Z", "M 180 218 Q 200 205 220 218 L 220 220 L 180 220 Z"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              ) : (
                // Loose powder
                <path d="M 180 218 Q 200 208 220 218 L 220 220 L 180 220 Z" fill={powderColor} />
              )}
              {/* Crystal texture dots (only for non-paste/non-solid) */}
              {!isPaste && !isSolid && [
                { x: 188, y: 213 },
                { x: 200, y: 211 },
                { x: 212, y: 213 },
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="1" fill="#e2e8f0" opacity={0.7} />
              ))}
            </motion.g>
          )}
        </g>

        {/* Bunsen burner (below tripod) */}
        <ellipse cx="200" cy="240" rx="22" ry="4" fill="#1f2937" />
        <rect x="190" y="225" width="20" height="18" fill="#374151" rx="2" />
        <rect x="196" y="180" width="8" height="50" fill="#4b5563" rx="1" />
        <rect x="193" y="172" width="14" height="10" fill="#1f2937" rx="1" />

        {/* Burner flame (small, gentle — 373 K is gentle heat) */}
        {burnerOn && (
          <motion.g initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} style={{ transformOrigin: "200px 175px" }}>
            <motion.path d="M 200 175 Q 194 158 197 142 Q 200 134 203 142 Q 206 158 200 175 Z" fill="url(#flameOuterSmall)" animate={{ d: ["M 200 175 Q 194 158 197 142 Q 200 134 203 142 Q 206 158 200 175 Z", "M 200 175 Q 193 158 196 140 Q 200 132 204 140 Q 207 158 200 175 Z", "M 200 175 Q 194 158 197 142 Q 200 134 203 142 Q 206 158 200 175 Z"], transition: { duration: 0.5, repeat: Infinity } }} />
            <path d="M 200 175 Q 198 165 199 152 Q 200 146 201 152 Q 202 165 200 175 Z" fill="url(#flameInnerSmall)" />
          </motion.g>
        )}

        {/* Steam rising from crucible */}
        {steam && [0, 1, 2].map((i) => (
          <motion.ellipse
            key={i}
            cx={195 + i * 5}
            cy={185}
            rx="4" ry="2"
            fill="#ffffff" opacity={0.6}
            animate={{
              cy: [185, 130, 80],
              opacity: [0.7, 0.4, 0],
              rx: [4, 8, 12],
              ry: [2, 4, 6],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        {/* Water drops falling (during add-water phase) */}
        {phase === "add-water" && !waterAdded && (
          <motion.g
            animate={{ y: [0, 50, 50, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <ellipse cx="200" cy="120" rx="3" ry="4" fill="rgba(219,234,254,0.9)" />
            <ellipse cx="195" cy="135" rx="2" ry="3" fill="rgba(219,234,254,0.7)" />
            <ellipse cx="205" cy="150" rx="2.5" ry="3.5" fill="rgba(219,234,254,0.8)" />
          </motion.g>
        )}

        {/* Top labels */}
        {phase === "add-gypsum" && !gypsumAdded && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty crucible — add gypsum (CaSO₄·2H₂O) powder
          </text>
        )}
        {phase === "heat" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Gypsum in crucible — heat GENTLY at 373 K (100°C)
          </text>
        )}
        {phase === "observe-pop" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            ✅ Plaster of Paris (CaSO₄·½H₂O) formed — still white powder
          </text>
        )}
        {phase === "add-water" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.8">
            Add water to the Plaster of Paris powder
          </text>
        )}
        {phase === "observe-set" && (
          <text x="200" y="50" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            {isSolid ? "✅ PoP has SET into hard solid gypsum" : isPaste ? "🔄 Paste hardening — exothermic setting…" : "Adding water…"}
          </text>
        )}

        <defs>
          <linearGradient id="flameOuterSmall" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="flameInnerSmall" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
