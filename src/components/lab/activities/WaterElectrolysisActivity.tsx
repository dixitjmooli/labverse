"use client";

// ─── Activity 1.4b — Electrolysis of Water (Electrolytic Decomposition) ─────
// Equation: 2H₂O →electricity→ 2H₂↑ + O₂↑
//
// Scene: A Hoffmann voltameter / U-tube apparatus with two platinum electrodes
// connected to a battery. Water (acidulated) fills the apparatus. When the
// current is switched on, bubbles of H₂ form at the cathode and O₂ at the
// anode (volume ratio H₂ : O₂ = 2 : 1). The gases collect at the top of each
// arm and displace the water downward.
//
// Confirmatory tests:
//   - H₂: burning matchstick at the cathode tap → "pop" sound
//   - O₂: glowing splint at the anode tap → rekindles

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityClassify, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type Phase = "intro" | "add-water" | "connect-battery" | "switch-on" | "observe" | "test-h2" | "test-o2" | "classify" | "results";

type GasCollection = { h2: number; o2: number }; // 0..100 percent of arm filled with gas

const TOTAL_STEPS = 6;

const STEPS: Record<Exclude<Phase, "intro" | "results">, { title: string; instruction: string }> = {
  "add-water":      { title: "Fill with Acidulated Water", instruction: "Fill the Hoffmann voltameter with WATER containing a few drops of dilute sulphuric acid (acidulated water — pure water is a poor conductor)." },
  "connect-battery":{ title: "Connect the Battery",        instruction: "Connect the two platinum electrodes to a 6V battery using conducting wires. The CATHODE (−) is on the left, the ANODE (+) on the right." },
  "switch-on":      { title: "Switch On the Current",       instruction: "Turn on the current. Electrolysis begins: H₂ evolves at the cathode, O₂ at the anode." },
  "observe":        { title: "Observe Gas Collection",      instruction: "Watch the gases collect at the top of each arm. Note the VOLUME RATIO — there should be twice as much H₂ as O₂ (2:1 by volume)." },
  "test-h2":        { title: "Test for Hydrogen",           instruction: "Open the cathode tap and bring a BURNING matchstick to the mouth. A 'POP' sound confirms H₂ gas." },
  "test-o2":        { title: "Test for Oxygen",             instruction: "Open the anode tap and bring a GLOWING splint to the mouth. It REKINDLES (bursts into flame) — confirms O₂ gas." },
  "classify":       { title: "Classify the Reaction",       instruction: "Water decomposes into H₂ and O₂ using ELECTRICAL energy. What type of reaction is this?" },
};

const OPTIONS = ["Combination", "Decomposition", "Displacement", "Double Displacement", "Oxidation-Reduction"];
const CORRECT = "Decomposition";
const EQUATION = "2H₂O → 2H₂↑ + O₂↑";

const RECAP = [
  "When an electric current is passed through acidulated water (water with a few drops of dilute H₂SO₄), the water decomposes into hydrogen and oxygen gases. This is ELECTROLYTIC DECOMPOSITION — the energy comes from electricity, not heat or light.",
  "The balanced equation is 2H₂O → 2H₂↑ + O₂↑. The volumes of gases collected are in the ratio H₂ : O₂ = 2 : 1, which matches the stoichiometry (2 moles of H₂ for every 1 mole of O₂).",
  "Pure water is a poor conductor of electricity (only ~1 in 10 million molecules ionise). Adding a few drops of dilute sulphuric acid provides H⁺ and SO₄²⁻ ions that carry the current — SO₄²⁻ is not discharged at the anode (water is oxidised more easily), so the net reaction is the decomposition of water.",
  "At the CATHODE (negative electrode, where reduction happens): 2H⁺ + 2e⁻ → H₂↑. At the ANODE (positive electrode, where oxidation happens): 2H₂O → O₂↑ + 4H⁺ + 4e⁻.",
  "Hydrogen is confirmed by the 'POP' test (a lighted matchstick at the mouth of the tube ignites the H₂). Oxygen is confirmed by the GLOWING splint test (a glowing splint rekindles/bursts back into flame in the O₂-rich atmosphere).",
  "Electrolysis is widely used industrially: electroplating, extraction of reactive metals (Na, K, Al — via electrolysis of molten salts), electrorefining of copper, and the production of chlorine and caustic soda from brine.",
];

const SAFETY_NOTES = [
  "Use only LOW voltage DC (6V or less) — household mains AC is dangerous and will not split water cleanly.",
  "H₂ is flammable and forms explosive mixtures with air — keep flames away during collection.",
  "Use a well-ventilated area — both H₂ and O₂ support combustion.",
];

export function WaterElectrolysisActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [waterFilled, setWaterFilled] = useState(false);
  const [batteryConnected, setBatteryConnected] = useState(false);
  const [currentOn, setCurrentOn] = useState(false);
  const [gasCollection, setGasCollection] = useState<GasCollection>({ h2: 0, o2: 0 });
  const [h2Tested, setH2Tested] = useState(false);
  const [o2Tested, setO2Tested] = useState(false);
  const [observation, setObservation] = useState<string | null>(null);
  const [obsVariant, setObsVariant] = useState<"info" | "success" | "warning">("info");
  const [showContinue, setShowContinue] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const stepIndex =
    phase === "add-water" ? 0 :
    phase === "connect-battery" ? 1 :
    phase === "switch-on" ? 2 :
    phase === "observe" ? 3 :
    phase === "test-h2" ? 4 :
    phase === "test-o2" ? 5 :
    phase === "classify" ? 6 : 0;

  const reset = useCallback(() => {
    setPhase("intro"); setWaterFilled(false); setBatteryConnected(false); setCurrentOn(false);
    setGasCollection({ h2: 0, o2: 0 }); setH2Tested(false); setO2Tested(false);
    setObservation(null); setSelectedAnswer(null); setShowContinue(false);
  }, []);

  const handleWater = useCallback(() => {
    if (phase !== "add-water" || waterFilled) return;
    setWaterFilled(true);
    sfx.playPour();
    setObservation("Acidulated water (water with a few drops of dilute H₂SO₄) fills the voltameter. Both arms are now full of liquid — no gases yet.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, waterFilled]);

  const handleBattery = useCallback(() => {
    if (phase !== "connect-battery" || batteryConnected) return;
    setBatteryConnected(true);
    sfx.playDrop();
    setObservation("The battery is connected: CATHODE (−, black) → left electrode, ANODE (+, red) → right electrode. Wires are in place — ready to switch on.");
    setObsVariant("success");
    setShowContinue(true);
  }, [phase, batteryConnected]);

  const handleSwitch = useCallback(() => {
    if (phase !== "switch-on" || currentOn) return;
    setCurrentOn(true);
    sfx.playPour();
    setPhase("observe");
    setObservation("⚡ Current is ON. Bubbles of H₂ rise at the cathode (left) and bubbles of O₂ rise at the anode (right). The gases are displacing the water downward.");
    setObsVariant("info");

    // Gradually fill the gas arms over ~5 seconds (2:1 ratio)
    playReactionSound("effervescence");
    const startTime = Date.now();
    const duration = 5000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      // H₂ fills to 60%, O₂ fills to 30% — ratio 2:1
      setGasCollection({ h2: progress * 60, o2: progress * 30 });
      if (progress >= 1) {
        clearInterval(interval);
        sfx.playSuccess();
        setObservation("✅ Gases collected. The LEFT arm has MORE gas (H₂) and the RIGHT arm has LESS (O₂). The volume ratio is 2:1 — exactly matching the balanced equation.");
        setObsVariant("success");
        setShowContinue(true);
      }
    }, 100);
  }, [phase, currentOn]);

  const handleH2Test = useCallback(() => {
    if (phase !== "test-h2" || h2Tested) return;
    setH2Tested(true);
    sfx.playError();
    setTimeout(() => {
      sfx.playSuccess();
      setObservation("💥 'POP!' A burning matchstick at the cathode tap makes a sharp pop sound. This confirms the gas at the cathode is HYDROGEN (H₂).");
      setObsVariant("success");
      setShowContinue(true);
    }, 600);
  }, [phase, h2Tested]);

  const handleO2Test = useCallback(() => {
    if (phase !== "test-o2" || o2Tested) return;
    setO2Tested(true);
    setTimeout(() => {
      sfx.playSuccess();
      setObservation("🔥 The glowing splint REKINDLES (bursts back into flame) at the anode tap. This confirms the gas at the anode is OXYGEN (O₂).");
      setObsVariant("success");
      setShowContinue(true);
    }, 600);
  }, [phase, o2Tested]);

  const handleContinue = useCallback(() => {
    setShowContinue(false); setObservation(null);
    if (phase === "add-water") setPhase("connect-battery");
    else if (phase === "connect-battery") setPhase("switch-on");
    else if (phase === "observe") setPhase("test-h2");
    else if (phase === "test-h2") setPhase("test-o2");
    else if (phase === "test-o2") setPhase("classify");
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
          emoji="⚡"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="Electrolysis of water: pass electricity through acidulated water and watch it split into H₂ (at the cathode) and O₂ (at the anode) in a 2:1 volume ratio. The third type of decomposition reaction — driven by electricity."
          steps={[
            { title: "Fill with Acidulated Water", desc: "Water with a few drops of dilute H₂SO₄ (provides ions to conduct current)." },
            { title: "Connect the Battery", desc: "Cathode (−) on the left, anode (+) on the right, via conducting wires." },
            { title: "Switch On the Current", desc: "Electrolysis begins: H₂ evolves at the cathode, O₂ at the anode." },
            { title: "Observe the 2:1 Ratio", desc: "The cathode arm fills with twice as much gas as the anode arm." },
            { title: "Test for H₂ and O₂", desc: "Pop test at cathode, glowing splint rekindles at anode." },
            { title: "Classify the Reaction", desc: "Water decomposes using electrical energy — what type is this?" },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("add-water")}
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
      <ActivityHeader emoji="⚡" gradient={manifest.gradient} name={manifest.title} category="Chemical Reactions and Equations" stepNumber={stepIndex} totalSteps={TOTAL_STEPS} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-2xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={stepIndex + 1} totalSteps={TOTAL_STEPS} title={stepInfo.title} instruction={stepInfo.instruction} />
        <WaterElectrolysisScene
          waterFilled={waterFilled}
          batteryConnected={batteryConnected}
          currentOn={currentOn}
          gasCollection={gasCollection}
          h2Tested={h2Tested}
          o2Tested={o2Tested}
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
          {phase === "add-water" && (
            <ToolButton emoji="💧" label="Acidulated Water" onClick={handleWater} disabled={waterFilled} highlighted={!waterFilled} />
          )}
          {phase === "connect-battery" && (
            <ToolButton emoji="🔋" label="Connect Battery" onClick={handleBattery} disabled={batteryConnected} highlighted={!batteryConnected} />
          )}
          {phase === "switch-on" && (
            <ToolButton emoji="⚡" label="Switch On" onClick={handleSwitch} disabled={currentOn} highlighted={!currentOn} />
          )}
          {phase === "observe" && (
            <div className="text-xs text-gray-400 italic px-4 py-3">Watching gases collect in a 2:1 ratio…</div>
          )}
          {phase === "test-h2" && (
            <ToolButton emoji="💥" label="Pop Test at Cathode" onClick={handleH2Test} disabled={h2Tested} highlighted={!h2Tested} />
          )}
          {phase === "test-o2" && (
            <ToolButton emoji="🔥" label="Glowing Splint at Anode" onClick={handleO2Test} disabled={o2Tested} highlighted={!o2Tested} />
          )}
          {phase === "classify" && (
            <div className="text-xs text-gray-500 italic px-4 py-2">Scroll down to choose your answer ↓</div>
          )}
        </div>
        {showContinue && phase !== "classify" && (
          <ContinueButton onClick={handleContinue} gradient={manifest.gradient} />
        )}
        {phase === "classify" && (
          <ActivityClassify question="What type of reaction is 2H₂O → 2H₂ + O₂ (using electricity)?" options={OPTIONS} onSelect={handleClassify} selected={selectedAnswer} />
        )}
      </main>
    </ActivityShell>
  );
}

// ─── SVG Scene: Hoffmann Voltameter (U-apparatus with two vertical arms) ────

function WaterElectrolysisScene({
  waterFilled, batteryConnected, currentOn, gasCollection, h2Tested, o2Tested, phase,
}: {
  waterFilled: boolean; batteryConnected: boolean; currentOn: boolean;
  gasCollection: GasCollection; h2Tested: boolean; o2Tested: boolean; phase: Phase;
}) {
  // Arm geometry: each arm is x=120-150 (left, cathode) and x=250-280 (right, anode)
  // Arms go from y=80 (top, with tap) to y=240 (bottom, joins at cross-piece)
  // Cross-piece at y=240 connecting both arms at the bottom
  // Each arm's liquid level drops as gas fills from the top

  const leftLiquidTopY = 80 + (gasCollection.h2 / 100) * 140; // 80 (empty/top) → 220 (full)
  const rightLiquidTopY = 80 + (gasCollection.o2 / 100) * 140;

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Bench */}
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* ─── Retort stand (left side) ───────────────────────────────── */}
        <rect x="20" y="100" width="6" height="140" fill="#475569" rx="1" />
        <rect x="0" y="238" width="50" height="6" fill="#1f2937" rx="1" />
        {/* Clamp holding the apparatus */}
        <rect x="25" y="155" width="95" height="6" fill="#475569" rx="1" />
        <rect x="118" y="148" width="14" height="20" fill="#1f2937" rx="2" />

        {/* ─── Hoffmann Voltameter apparatus ─────────────────────────── */}
        {/* Left arm (CATHODE — H₂ collects here) */}
        <g>
          {/* Gas collection zone (top of left arm) — only visible when gas is present */}
          {gasCollection.h2 > 0 && (
            <rect x="120" y="80" width="30" height={leftLiquidTopY - 80} fill="rgba(186,230,253,0.6)" stroke="none" />
          )}
          {/* Liquid (water) in left arm — fills from gas level down to bottom */}
          {waterFilled && (
            <rect x="120" y={Math.max(80, leftLiquidTopY)} width="30" height={240 - Math.max(80, leftLiquidTopY)} fill="rgba(219,234,254,0.7)" />
          )}
          {/* Left arm outline */}
          <rect x="120" y="80" width="30" height="160" fill="none" stroke="#475569" strokeWidth="2" rx="2" />
          {/* Tap at top */}
          <rect x="116" y="74" width="38" height="8" fill="#1f2937" rx="2" />
          <circle cx="135" cy="78" r="3" fill="#6b7280" stroke="#1f2937" strokeWidth="0.5" />

          {/* Bubbles at the cathode (left electrode, rising) */}
          {currentOn && [0, 1, 2, 3].map((i) => (
            <motion.circle
              key={i}
              cx={135}
              cy={230}
              r={1.5 + (i % 2)}
              fill="#ffffff"
              opacity={0.8}
              animate={{
                cy: [230, leftLiquidTopY + 5],
                opacity: [0.9, 0.9, 0],
                r: [1.5 + (i % 2), 2.5 + (i % 2)],
              }}
              transition={{ duration: 1.2 + (i * 0.1), repeat: Infinity, delay: i * 0.25, ease: "easeOut" }}
            />
          ))}
        </g>

        {/* Right arm (ANODE — O₂ collects here) */}
        <g>
          {gasCollection.o2 > 0 && (
            <rect x="250" y="80" width="30" height={rightLiquidTopY - 80} fill="rgba(186,230,253,0.6)" stroke="none" />
          )}
          {waterFilled && (
            <rect x="250" y={Math.max(80, rightLiquidTopY)} width="30" height={240 - Math.max(80, rightLiquidTopY)} fill="rgba(219,234,254,0.7)" />
          )}
          <rect x="250" y="80" width="30" height="160" fill="none" stroke="#475569" strokeWidth="2" rx="2" />
          <rect x="246" y="74" width="38" height="8" fill="#1f2937" rx="2" />
          <circle cx="265" cy="78" r="3" fill="#6b7280" stroke="#1f2937" strokeWidth="0.5" />

          {/* Bubbles at the anode (right electrode, rising) — fewer than at cathode */}
          {currentOn && [0, 1].map((i) => (
            <motion.circle
              key={i}
              cx={265}
              cy={230}
              r={1.5 + (i % 2)}
              fill="#ffffff"
              opacity={0.8}
              animate={{
                cy: [230, rightLiquidTopY + 5],
                opacity: [0.9, 0.9, 0],
                r: [1.5 + (i % 2), 2.5 + (i % 2)],
              }}
              transition={{ duration: 1.4 + (i * 0.15), repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
            />
          ))}
        </g>

        {/* Cross-piece (U-bend) connecting both arms at the bottom */}
        <path d="M 120 220 Q 120 245 145 245 L 255 245 Q 280 245 280 220" fill="none" stroke="#475569" strokeWidth="2" />
        {waterFilled && (
          <path d="M 120 220 Q 120 243 145 243 L 255 243 Q 280 243 280 220" fill="rgba(219,234,254,0.7)" stroke="none" />
        )}

        {/* ─── Platinum electrodes (inside each arm, near the bottom) ──── */}
        {/* Left electrode (cathode) */}
        <rect x="133" y="200" width="4" height="40" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
        {/* Right electrode (anode) */}
        <rect x="263" y="200" width="4" height="40" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />

        {/* ─── Connecting wires + battery (when connected) ──────────────── */}
        {batteryConnected && (
          <>
            {/* Wire from left electrode going down, then left to battery */}
            <path d="M 135 240 L 135 265 L 60 265 L 60 230" fill="none" stroke="#1f2937" strokeWidth="2" />
            {/* Wire from right electrode going down, then right, then to battery */}
            <path d="M 265 240 L 265 275 L 90 275 L 90 230" fill="none" stroke="#dc2626" strokeWidth="2" />

            {/* Battery (centered between wires) */}
            <rect x="55" y="195" width="40" height="35" fill="#1f2937" rx="3" />
            {/* Battery + and - terminals */}
            <text x="65" y="217" textAnchor="middle" fontSize="14" fill="#ffffff" fontWeight="bold">−</text>
            <text x="85" y="217" textAnchor="middle" fontSize="14" fill="#ffffff" fontWeight="bold">+</text>
            {/* Battery label */}
            <text x="75" y="245" textAnchor="middle" fontSize="7" fill="#1f2937" fontWeight="bold">6V</text>

            {/* Polarity labels at the electrodes */}
            <text x="135" y="195" textAnchor="middle" fontSize="8" fill="#1f2937" fontWeight="bold">CATHODE (−)</text>
            <text x="265" y="195" textAnchor="middle" fontSize="8" fill="#dc2626" fontWeight="bold">ANODE (+)</text>
          </>
        )}

        {/* ─── Gas labels (when collection has begun) ──────────────────── */}
        {gasCollection.h2 > 5 && (
          <text x="135" y="65" textAnchor="middle" fontSize="9" fill="#0ea5e9" fontWeight="bold">H₂ ↑</text>
        )}
        {gasCollection.o2 > 5 && (
          <text x="265" y="65" textAnchor="middle" fontSize="9" fill="#dc2626" fontWeight="bold">O₂ ↑</text>
        )}

        {/* ─── Pop test at cathode (H₂ test) ──────────────────────────── */}
        {phase === "test-h2" && (
          <motion.g
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: h2Tested ? 30 : 5, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
          >
            {/* Matchstick at left tap */}
            <rect x="133" y="40" width="4" height="30" fill="#d4a574" rx="1" />
            <ellipse cx="135" cy="38" rx="3" ry="4" fill={h2Tested ? "#f97316" : "#7c2d12"} />
            {h2Tested && (
              <motion.g
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2, 2.5], opacity: [1, 0.8, 0] }}
                transition={{ duration: 0.8 }}
                style={{ transformOrigin: "135px 38px" }}
              >
                <circle cx="135" cy="38" r="10" fill="#fef3c7" opacity="0.9" />
                <text x="135" y="42" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#dc2626">POP!</text>
              </motion.g>
            )}
          </motion.g>
        )}

        {/* ─── Glowing splint at anode (O₂ test) ──────────────────────── */}
        {phase === "test-o2" && (
          <motion.g
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: o2Tested ? 30 : 5, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
          >
            <rect x="263" y="40" width="4" height="30" fill="#a16207" rx="1" />
            {/* Glowing ember at tip */}
            {!o2Tested && (
              <motion.circle cx="265" cy="38" r="3" fill="#dc2626" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 0.5, repeat: Infinity }} />
            )}
            {/* Rekindled flame */}
            {o2Tested && (
              <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "265px 38px" }}>
                <motion.path d="M 265 38 Q 261 30 265 22 Q 269 30 265 38 Z" fill="#f97316" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.3, repeat: Infinity }} style={{ transformOrigin: "265px 36px" }} />
                <ellipse cx="265" cy="33" rx="1.5" ry="2" fill="#fef3c7" />
              </motion.g>
            )}
          </motion.g>
        )}

        {/* ─── Top labels ─────────────────────────────────────────────── */}
        {phase === "add-water" && !waterFilled && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Empty voltameter — fill with acidulated water
          </text>
        )}
        {phase === "connect-battery" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Water filled — connect the 6V battery
          </text>
        )}
        {phase === "switch-on" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#92400e" fontWeight="bold" opacity="0.7">
            Battery connected — switch on the current
          </text>
        )}
        {phase === "observe" && (
          <text x="200" y="40" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="bold" opacity="0.8">
            ⚡ H₂ at cathode (left), O₂ at anode (right) — 2:1 ratio
          </text>
        )}
      </svg>
    </div>
  );
}
