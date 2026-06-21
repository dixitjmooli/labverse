"use client";

// ─── Activity 2.8 — pH Test using Universal Indicator ────────────────────────
// NCERT Class 10 · Science · Chapter 2 · Activity 2.8
//
// Test 6 solutions with universal indicator and match the colour to a pH chart:
//   - Dilute HCl (strong acid)        → pH 1 (red)
//   - Lemon juice (weak acid)         → pH 3 (orange)
//   - Water (neutral)                 → pH 7 (green)
//   - Milk of magnesia (weak base)    → pH 10 (blue)
//   - NaOH (strong base)              → pH 13 (violet)
//   - Baking soda (weak base)         → pH 9 (blue-green)

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx } from "@/lib/sound-engine";
import {
  ActivityShell, ActivityIntro, ActivityHeader, ActivityStepHeader,
  ToolButton, ObservationBanner, ActivityResults, ContinueButton,
} from "../ActivityPrimitives";

type Phase = "intro" | "test" | "results";

interface Solution {
  id: string;
  name: string;
  formula: string;
  ph: number;
  color: string;       // colour when UI is added
  category: "Strong Acid" | "Weak Acid" | "Neutral" | "Weak Base" | "Strong Base";
  gradient: string;
}

const SOLUTIONS: Solution[] = [
  { id: "hcl",      name: "Dilute HCl",            formula: "HCl",       ph: 1,  color: "#ef4444", category: "Strong Acid", gradient: "from-red-500 to-red-600" },
  { id: "lemon",    name: "Lemon Juice",           formula: "Citric Acid", ph: 3, color: "#f97316", category: "Weak Acid",   gradient: "from-orange-400 to-orange-500" },
  { id: "water",    name: "Distilled Water",       formula: "H₂O",       ph: 7,  color: "#22c55e", category: "Neutral",      gradient: "from-green-400 to-green-500" },
  { id: "baking",   name: "Baking Soda Solution",  formula: "NaHCO₃",    ph: 9,  color: "#0ea5e9", category: "Weak Base",    gradient: "from-sky-400 to-sky-500" },
  { id: "mag",      name: "Milk of Magnesia",      formula: "Mg(OH)₂",   ph: 10, color: "#3b82f6", category: "Weak Base",    gradient: "from-blue-500 to-blue-600" },
  { id: "naoh",     name: "Sodium Hydroxide",      formula: "NaOH",      ph: 13, color: "#7c3aed", category: "Strong Base",  gradient: "from-violet-500 to-purple-600" },
];

const EQUATION = "pH = -log₁₀[H⁺]    (1 = strong acid, 7 = neutral, 14 = strong base)";

const RECAP = [
  "pH is a measure of the acidity or basicity of a solution. The pH scale runs from 0 to 14: 7 is neutral (pure water), below 7 is acidic (more H⁺ ions), above 7 is basic/alkaline (more OH⁻ ions).",
  "The formula is pH = -log₁₀[H⁺], where [H⁺] is the concentration of hydrogen ions in moles per litre. A change of 1 on the pH scale means a 10× change in H⁺ concentration — so pH 2 is 10× more acidic than pH 3, and 100× more acidic than pH 4.",
  "Strong acids (HCl, H₂SO₄, HNO₃) ionise completely in water and have very low pH (0-3). Weak acids (acetic acid in vinegar, citric acid in lemon) only partially ionise — pH 4-6. Strong bases (NaOH, KOH) have very high pH (11-14). Weak bases (NH₃, NaHCO₃, Mg(OH)₂) have pH 8-10.",
  "Universal Indicator is a mixture of several dyes that produces a different colour at each pH value: RED (pH 1-2, strong acid), ORANGE (pH 3-4, weak acid), YELLOW (pH 5-6, very weak acid), GREEN (pH 7, neutral), BLUE (pH 8-11, weak base), VIOLET/PURPLE (pH 12-14, strong base).",
  "Pure water is neutral because the H⁺ and OH⁻ concentrations are equal (both 10⁻⁷ M at 25°C, giving pH 7). Rainwater has pH ≈ 5.6 (slightly acidic due to dissolved CO₂ forming carbonic acid). Acid rain has pH < 5.6 (due to SO₂ and NO₂ pollutants).",
  "Practical applications of pH: (1) Soil pH controls nutrient availability — most crops prefer pH 6-7. (2) Blood pH is tightly regulated at 7.35-7.45; outside this range is fatal. (3) Stomach pH ≈ 1-2 (HCl digest food). (4) Toothpaste is mildly basic to neutralise the acids produced by bacteria on teeth.",
];

const SAFETY_NOTES = [
  "Universal indicator stains — handle with care.",
  "Strong acids (HCl) and strong bases (NaOH) are corrosive.",
  "Always add acid TO water, never water TO acid (dilution rule).",
];

export function PhTestActivity({ manifest }: { manifest: ExperimentManifest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [tested, setTested] = useState<Set<string>>(new Set());

  const reset = useCallback(() => {
    setPhase("intro"); setTested(new Set());
  }, []);

  const handleTest = useCallback((solId: string) => {
    if (tested.has(solId)) return;
    sfx.playDrop();
    setTested(prev => new Set([...prev, solId]));
  }, [tested]);

  const allTested = tested.size === SOLUTIONS.length;

  if (phase === "intro") {
    return (
      <ActivityShell manifest={manifest}>
        <ActivityIntro
          emoji="🌈"
          gradient={manifest.gradient}
          name={manifest.title}
          desc="NCERT Activity 2.8: Add universal indicator to 6 mystery solutions. Match each colour to the pH scale (1-14) to determine if each is a strong acid, weak acid, neutral, weak base, or strong base."
          steps={[
            { title: "6 Mystery Solutions", desc: "Dilute HCl, lemon juice, distilled water, baking soda, milk of magnesia, NaOH — labels hidden." },
            { title: "Add Universal Indicator", desc: "Click each solution to add UI. Watch the colour change." },
            { title: "Match to pH Scale", desc: "Compare each colour to the pH chart (red=1, green=7, violet=14)." },
            { title: "Read the pH", desc: "Each solution's pH tells you its strength as an acid or base." },
          ]}
          safetyNotes={SAFETY_NOTES}
          onStart={() => setPhase("test")}
        />
      </ActivityShell>
    );
  }

  if (phase === "results") {
    return (
      <ActivityShell manifest={manifest}>
        <ActivityResults
          correct={true}
          selectedAnswer="All 6 solutions tested"
          correctAnswer="All 6 solutions tested"
          equation={EQUATION}
          recap={RECAP}
          gradient={manifest.gradient}
          onReset={reset}
        />
      </ActivityShell>
    );
  }

  return (
    <ActivityShell manifest={manifest}>
      <ActivityHeader emoji="🌈" gradient={manifest.gradient} name={manifest.title} category="Acids, Bases and Salts" stepNumber={0} totalSteps={1} onReset={reset} />
      <main className="flex flex-col items-center p-4 max-w-3xl mx-auto w-full gap-4 pb-12">
        <ActivityStepHeader stepNumber={1} totalSteps={1} title="Add Universal Indicator" instruction="Click each test tube to add universal indicator. Compare the colour to the pH chart on the right." />

        {/* pH scale chart */}
        <PhScaleChart />

        {/* Solutions grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl">
          {SOLUTIONS.map((sol, i) => {
            const isTested = tested.has(sol.id);
            return (
              <motion.button
                key={sol.id}
                onClick={() => handleTest(sol.id)}
                className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 hover:shadow-lg transition-all text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: isTested ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Mini test tube visual */}
                <div className="flex justify-center mb-2">
                  <svg viewBox="0 0 30 80" className="w-7 h-16">
                    {/* Tube outline */}
                    <rect x="6" y="4" width="18" height="68" fill="rgba(255,255,255,0.15)" stroke="#475569" strokeWidth="1.5" rx="2" />
                    <rect x="4" y="2" width="22" height="4" fill="none" stroke="#475569" strokeWidth="1.5" rx="1" />
                    {/* Liquid */}
                    <rect x="7" y="20" width="16" height="50" fill={isTested ? sol.color : "rgba(219,234,254,0.4)"} />
                    <ellipse cx="15" cy="20" rx="8" ry="1.2" fill={isTested ? sol.color : "rgba(219,234,254,0.4)"} />
                    {/* Glass shine */}
                    <line x1="9" y1="68" x2="9" y2="22" stroke="#ffffff" strokeWidth="0.8" opacity={isTested ? 0.5 : 0.4} />
                  </svg>
                </div>
                {/* Label */}
                <p className="text-[10px] font-bold text-gray-700 leading-tight">Sample {String.fromCharCode(65 + i)}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">{isTested ? sol.name : "Untested"}</p>
                {isTested && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-gradient-to-r ${sol.gradient}`}
                  >
                    pH {sol.ph} · {sol.category}
                  </motion.div>
                )}
                {!isTested && (
                  <p className="mt-1.5 text-[9px] text-amber-500 font-semibold">Click to test →</p>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Continue button */}
        {allTested && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <ContinueButton onClick={() => setPhase("results")} label="See Recap" gradient={manifest.gradient} />
          </motion.div>
        )}
        {!allTested && (
          <p className="text-xs text-gray-400 italic mt-2">
            Tested {tested.size} of {SOLUTIONS.length} solutions — test all to continue
          </p>
        )}
      </main>
    </ActivityShell>
  );
}

function PhScaleChart() {
  return (
    <div className="bg-white/90 rounded-2xl p-3 shadow-lg border border-gray-100 w-full max-w-2xl">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center mb-2">pH Scale (Universal Indicator Colours)</p>
      <div className="flex h-8 rounded-lg overflow-hidden border border-gray-200">
        {[
          { ph: 1, color: "#dc2626", label: "1" },
          { ph: 2, color: "#ea580c", label: "2" },
          { ph: 3, color: "#f97316", label: "3" },
          { ph: 4, color: "#facc15", label: "4" },
          { ph: 5, color: "#eab308", label: "5" },
          { ph: 6, color: "#84cc16", label: "6" },
          { ph: 7, color: "#22c55e", label: "7" },
          { ph: 8, color: "#10b981", label: "8" },
          { ph: 9, color: "#06b6d4", label: "9" },
          { ph: 10, color: "#0ea5e9", label: "10" },
          { ph: 11, color: "#3b82f6", label: "11" },
          { ph: 12, color: "#6366f1", label: "12" },
          { ph: 13, color: "#7c3aed", label: "13" },
          { ph: 14, color: "#9333ea", label: "14" },
        ].map((s) => (
          <div key={s.ph} className="flex-1 flex flex-col items-center justify-center text-white font-bold text-[8px]" style={{ background: s.color }}>
            {s.label}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-gray-500 font-bold">
        <span>← Strong Acid</span>
        <span>Neutral</span>
        <span>Strong Base →</span>
      </div>
    </div>
  );
}
