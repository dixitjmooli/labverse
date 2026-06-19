"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Zap } from "lucide-react";
import type { TestDef, ReactionResult } from "@/lib/lab-types";
import { StinkLines, FizzBubbles, GasBubbles } from "./VisualEffects";

export interface TubeState {
  id: string;
  unknownType: string;
  /**
   * Reagent IDs that have been added to this tube (in order added, no duplicates).
   * Replaces the legacy `r1Added`/`r2Added` booleans — supports N reagents.
   */
  addedReagentIds: string[];
  reaction: ReactionResult;
  liquidLevel: number;
  fizzing: boolean;
  stinking: boolean;
}

// ─── Test Tube SVG Visual ────────────────────────────────────────────────────
export function TestTubeVisual({
  tube,
  test,
  onClick,
  active,
  tubeRef,
}: {
  tube: TubeState;
  test: TestDef;
  onClick: () => void;
  active: boolean;
  tubeRef: (el: HTMLDivElement | null) => void;
}) {
  const { reaction, liquidLevel } = tube;
  // Map: 0 = empty, 1 = pre-filled sample (40%), 2 = +1 reagent (55%), 3 = +2 reagents (70%)
  const lPct = liquidLevel === 0 ? 0 : liquidLevel === 1 ? 40 : liquidLevel === 2 ? 55 : 70;
  const isSmell =
    reaction.visual === "foul-smell" ||
    reaction.visual === "fruity-smell" ||
    reaction.visual === "antiseptic-smell";
  const stinkColor =
    reaction.smellType === "foul"
      ? "#84cc16"
      : reaction.smellType === "antiseptic"
      ? "#818cf8"
      : "#f472b6";

  return (
    <motion.div
      ref={tubeRef as any}
      className={`relative flex flex-col items-center cursor-pointer select-none ${active ? "hover:scale-[1.03]" : ""}`}
      onClick={onClick}
      whileHover={active ? { y: -5 } : {}}
      whileTap={active ? { scale: 0.97 } : {}}
    >
      {(isSmell || tube.stinking) && <StinkLines color={stinkColor} />}
      <motion.div
        className={`text-base font-black mb-2 px-3 py-1.5 rounded-xl transition-all duration-300 ${
          tube.addedReagentIds.length > 0
            ? isSmell
              ? "bg-lime-100 text-lime-800 ring-2 ring-lime-400"
              : reaction.visual !== "no-reaction"
              ? "bg-emerald-100 text-emerald-800 shadow-md"
              : "bg-gray-100 text-gray-500"
            : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
        }`}
        layout
      >
        <span className="text-[9px] font-semibold uppercase tracking-wider opacity-70 mr-1">Sample</span>
        {tube.id}
      </motion.div>

      <div className="relative" style={{ width: 80, height: 190 }}>
        <svg viewBox="0 0 80 190" className="w-full h-full" style={{ overflow: "visible" }}>
          <rect x={14} y={4} width={52} height={8} rx={4} fill="#e5e7eb" stroke="#d1d5db" strokeWidth={1.5} />
          <path d="M18 12 L18 148 Q18 178 40 178 Q62 178 62 148 L62 12" fill="rgba(255,255,255,0.08)" stroke="#d1d5db" strokeWidth={2} strokeLinecap="round" />
          {liquidLevel > 0 && (
            <motion.path
              d={`M20 ${168 - lPct * 1.3} L20 148 Q20 176 40 176 Q60 176 60 148 L60 ${168 - lPct * 1.3}`}
              fill={reaction.liquidColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          )}
          {liquidLevel > 0 && (
            <motion.ellipse
              cx={40}
              cy={168 - lPct * 1.3}
              rx={20}
              ry={3}
              fill={reaction.liquidColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
          )}
          {(reaction.visual === "precipitate" || reaction.visual === "decolorize") && reaction.precipitateColor && (
            <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5, type: "spring" }}>
              <ellipse cx={40} cy={166} rx={16} ry={5} fill={reaction.precipitateColor} opacity={0.9} />
            </motion.g>
          )}
          {reaction.visual === "silver-mirror" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
              <rect x={19} y={40} width={5} height={90} rx={2} fill="rgba(192,192,192,0.4)" />
              <rect x={56} y={40} width={5} height={90} rx={2} fill="rgba(192,192,192,0.3)" />
              <rect x={22} y={50} width={36} height={3} rx={1} fill="rgba(192,192,192,0.2)" />
              <ellipse cx={40} cy={145} rx={18} ry={8} fill="rgba(192,192,192,0.25)" />
            </motion.g>
          )}
          {reaction.visual === "turbidity" && (
            <motion.rect
              x={20}
              y={50}
              width={40}
              height={110}
              rx={10}
              fill="rgba(255,255,255,0.5)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.5] }}
              transition={{ duration: reaction.turbiditySpeed === "immediate" ? 0.5 : 2, ease: "easeOut" }}
            />
          )}
          {reaction.visual === "oily-layer" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <ellipse cx={40} cy={168 - lPct * 1.3 + 6} rx={17} ry={3.5} fill="#fcd34d" opacity={0.7} />
            </motion.g>
          )}
          {reaction.visual === "dye" && (
            <motion.rect
              x={20}
              y={50}
              width={40}
              height={110}
              rx={10}
              fill={reaction.liquidColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          {isSmell && (
            <motion.ellipse
              cx={40}
              cy={130}
              rx={25}
              ry={28}
              fill={reaction.liquidColor}
              animate={{ opacity: [0.08, 0.2, 0.08], rx: [25, 30, 25] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
          <rect x={24} y={20} width={2.5} height={90} rx={1.25} fill="rgba(255,255,255,0.35)" />
        </svg>
        <FizzBubbles active={tube.fizzing} />
        {reaction.visual === "effervescence" && <GasBubbles active />}
        {liquidLevel === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase rotate-[-90deg]">empty</span>
          </div>
        )}
        {liquidLevel > 0 && tube.addedReagentIds.length === 0 && (
          <div className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none">
            <span className="text-slate-400/70 text-[9px] font-bold tracking-wider uppercase">unknown</span>
          </div>
        )}
      </div>

      <div className="flex gap-1 mt-1.5 min-h-[20px] flex-wrap justify-center max-w-[110px]">
        <AnimatePresence>
          {tube.addedReagentIds.map((rid) => {
            const reagent = test.reagents.find((r) => r.id === rid);
            if (!reagent) return null;
            return (
              <motion.span
                key={rid}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold border"
                style={{
                  color: reagent.accentColor,
                  backgroundColor: `${reagent.accentColor}15`,
                  borderColor: `${reagent.accentColor}40`,
                }}
              >
                {reagent.shortName}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {reaction.description && (
          <motion.div
            key={reaction.description}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`mt-0.5 text-[10px] text-center max-w-[130px] leading-snug font-medium ${
              tube.addedReagentIds.length === 0
                ? "text-slate-400 italic"
                : isSmell
                ? reaction.smellType === "foul"
                  ? "text-lime-700"
                  : "text-pink-700"
                : "text-gray-500"
            }`}
          >
            {reaction.description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Reagent Bottle SVG ──────────────────────────────────────────────────────
export function ReagentBottle({
  reagent,
  selected,
  onClick,
}: {
  reagent: TestDef["reagents"][0];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      className={`relative flex flex-col items-center cursor-pointer p-2.5 rounded-2xl transition-all ${
        selected
          ? `ring-[3px] ring-offset-2 shadow-xl scale-110 ${reagent.bgColor} ${reagent.ringColor}`
          : "hover:bg-gray-50 hover:shadow-md"
      }`}
      onClick={onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.93 }}
    >
      <div className="relative" style={{ width: 64, height: 100 }}>
        <svg viewBox="0 0 70 110" className="w-full h-full">
          <rect x={24} y={0} width={22} height={12} rx={3} fill={selected ? "#374151" : "#9ca3af"} />
          <rect x={27} y={12} width={16} height={18} fill={selected ? "#4b5563" : "#d1d5db"} />
          <rect x={10} y={30} width={50} height={65} rx={6} fill={selected ? "#f9fafb" : "#fff"} stroke={selected ? reagent.accentColor : "#e5e7eb"} strokeWidth={selected ? 2.5 : 1.5} />
          <rect x={13} y={55} width={44} height={37} rx={4} fill={reagent.liquidColor} opacity={0.6} />
          <rect x={18} y={38} width={34} height={22} rx={3} fill="white" stroke="#e5e7eb" strokeWidth={0.5} />
          <text x={35} y={52} textAnchor="middle" fontSize={7} fontWeight="bold" fill={reagent.accentColor}>
            {reagent.shortName}
          </text>
        </svg>
        {selected && (
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ y: [0, 3, 0], scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <Droplets className="w-4 h-4 text-blue-500" />
          </motion.div>
        )}
      </div>
      <div className={`mt-0.5 text-[10px] font-bold text-center leading-tight max-w-[90px] ${selected ? "text-gray-800" : "text-gray-400"}`}>
        {reagent.name}
      </div>
      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-emerald-600 font-semibold">
          <Zap className="inline w-3 h-3" /> Ready
        </motion.div>
      )}
    </motion.div>
  );
}
