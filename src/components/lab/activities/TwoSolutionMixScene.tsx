"use client";

// ─── Shared "Two Solution Mix" Scene ─────────────────────────────────────────
// Used by Activity 1.8 (Pb(NO₃)₂ + KI → yellow PbI₂) and Activity 1.9
// (Na₂SO₄ + BaCl₂ → white BaSO₄). Two test tubes; one pours into the other;
// a coloured precipitate forms.

import { motion } from "framer-motion";

export interface TwoSolutionMixConfig {
  /** Label of solution A (in the receiving test tube). */
  labelA: string;
  /** Short formula/label on tube A (e.g., "Pb(NO₃)₂"). */
  formulaA: string;
  /** Colour of solution A inside tube A. */
  colorA: string;
  /** Label of solution B (in the pouring tube). */
  labelB: string;
  formulaB: string;
  colorB: string;
  /** Colour of the precipitate that forms in tube A. */
  precipitateColor: string;
  /** Description shown during pouring + precipitate formation. */
  pouringDescription: string;
  /** Description shown after precipitate has formed. */
  finalDescription: string;
}

export function TwoSolutionMixScene({
  phase,
  config,
}: {
  phase: "empty" | "filled-a" | "pouring" | "done";
  config: TwoSolutionMixConfig;
}) {
  // Tube A (receiving) — at x=140, base at y=240
  // Tube B (pouring) — at x=300 when on the bench; moves to x=180 (above tube A) when pouring
  const tubeBX = phase === "pouring" ? 180 : 300;
  const tubeBY = phase === "pouring" ? 80 : 180;
  const tubeBRotation = phase === "pouring" ? -50 : 0;

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200"
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fde68a 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect x="0" y="240" width="400" height="60" fill="#92633a" />
        <rect x="0" y="240" width="400" height="3" fill="#6b4423" />

        {/* ─── Tube A (receiving) ───────────────────────────────────── */}
        <g>
          {/* Liquid in tube A */}
          <rect x="128" y="180" width="24" height="50" fill={config.colorA} opacity={phase === "empty" ? 0 : 0.7} />
          {/* Tube A outline */}
          <rect x="125" y="170" width="30" height="80" fill="none" stroke="#475569" strokeWidth="2" rx="3" />
          {/* Tube A mouth */}
          <rect x="122" y="166" width="36" height="6" fill="none" stroke="#475569" strokeWidth="2" rx="1" />
          {/* Glass shine */}
          <line x1="129" y1="240" x2="129" y2="180" stroke="#ffffff" strokeWidth="1" opacity="0.4" />

          {/* Precipitate forming at bottom of tube A */}
          {(phase === "pouring" || phase === "done") && (
            <motion.g
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: phase === "done" ? 1 : 0.6, scaleY: phase === "done" ? 1 : 0.5 }}
              transition={{ duration: 0.8 }}
              style={{ transformOrigin: "140px 230px" }}
            >
              <rect x="128" y="218" width="24" height="12" fill={config.precipitateColor} opacity="0.95" />
              {/* Precipitate texture */}
              {[132, 137, 142, 147].map((x) => (
                <circle key={x} cx={x} cy={222} r="1.3" fill={config.precipitateColor} stroke="#1f2937" strokeWidth="0.3" />
              ))}
            </motion.g>
          )}

          {/* Tube A label */}
          <text x="140" y="262" textAnchor="middle" fontSize="9" fill="#1f2937" fontWeight="bold">{config.formulaA}</text>
        </g>

        {/* ─── Tube B (pouring) ────────────────────────────────────── */}
        <motion.g
          animate={{ x: tubeBX - 300, y: tubeBY - 180, rotate: tubeBRotation }}
          transition={{ type: "spring", stiffness: 80, damping: 14 }}
          style={{ transformOrigin: "300px 180px" }}
        >
          {/* Liquid in tube B */}
          <rect x="288" y="120" width="24" height="50" fill={config.colorB} opacity="0.7" />
          {/* Tube B outline */}
          <rect x="285" y="110" width="30" height="80" fill="none" stroke="#475569" strokeWidth="2" rx="3" />
          {/* Tube B mouth */}
          <rect x="282" y="106" width="36" height="6" fill="none" stroke="#475569" strokeWidth="2" rx="1" />
          {/* Glass shine */}
          <line x1="289" y1="180" x2="289" y2="120" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
          {/* Tube B label */}
          <text x="300" y="202" textAnchor="middle" fontSize="9" fill="#1f2937" fontWeight="bold">{config.formulaB}</text>
        </motion.g>

        {/* ─── Pouring stream (when pouring) ────────────────────────── */}
        {phase === "pouring" && (
          <motion.path
            d={`M ${tubeBX + 12} ${tubeBY + 30} Q ${(tubeBX + 140) / 2} ${tubeBY + 60} 152 178`}
            stroke={config.colorB}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* ─── Swirl particles in tube A (when pouring) ─────────────── */}
        {phase === "pouring" && [0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            cx={135 + (i * 4)}
            cy={200}
            r="2"
            fill={config.precipitateColor}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: [0, 1, 0], y: 30 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </svg>

      {/* Description overlay */}
      <div className="absolute bottom-2 left-0 right-0 text-center px-4">
        <p className="text-[10px] text-gray-600 font-medium">
          {phase === "empty" && `${config.labelA} (${config.formulaA}) is in tube A. Pour in ${config.labelB} (${config.formulaB}) from tube B.`}
          {phase === "filled-a" && `Tube A has ${config.formulaA}. Add ${config.formulaB} to start the reaction.`}
          {phase === "pouring" && config.pouringDescription}
          {phase === "done" && config.finalDescription}
        </p>
      </div>
    </div>
  );
}
