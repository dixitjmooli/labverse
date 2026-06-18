"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { sfx } from "@/lib/sound-engine";

// ─── Stink Lines (foul smell) & green gas cloud ──────────────────────────────
export function StinkLines({ color = "#84cc16" }: { color?: string }) {
  return (
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-20 pointer-events-none z-30">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${15 + i * 25}%` }}
          animate={{ y: [-5, -25, -45], opacity: [0, 0.9, 0], x: [0, (i - 1) * 4, (i - 1) * 6] }}
          transition={{ duration: 1.8, delay: i * 0.3, repeat: Infinity, ease: "easeOut" }}
        >
          <svg width="20" height="30" viewBox="0 0 20 30">
            <path d="M5 28 Q10 20 5 15 Q0 10 5 5 Q10 0 8 2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M10 28 Q15 20 10 15 Q5 10 10 5 Q15 0 13 2" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
          </svg>
        </motion.div>
      ))}
      <motion.div
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-8 rounded-full"
        style={{ background: `radial-gradient(ellipse, ${color}55 0%, transparent 70%)` }}
        animate={{ scale: [0.8, 1.3, 0.9, 1.1], opacity: [0.4, 0.7, 0.3, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─── Fizz Bubbles ────────────────────────────────────────────────────────────
export function FizzBubbles({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/70"
          style={{
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            left: `${15 + Math.random() * 70}%`,
            bottom: "10%",
          }}
          animate={{ y: [0, -30 - Math.random() * 30], opacity: [0.8, 0.3, 0], scale: [1, 1.2, 0.5] }}
          transition={{ duration: 0.7 + Math.random() * 0.5, delay: Math.random() * 0.5, repeat: 3, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ─── Gas Bubbles (effervescence) ─────────────────────────────────────────────
export function GasBubbles({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/50 bg-white/10"
          style={{
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            left: `${20 + Math.random() * 60}%`,
            bottom: "15%",
          }}
          animate={{ y: [0, -50 - Math.random() * 40], opacity: [0.7, 0] }}
          transition={{ duration: 1.2 + Math.random() * 0.6, delay: Math.random() * 0.8, repeat: 4, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ─── Student Reaction (popup character reacting to smells) ───────────────────
export function StudentReaction({
  show,
  type,
}: {
  show: boolean;
  type: "foul" | "fruity" | "antiseptic" | null;
}) {
  const isFoul = type === "foul";
  const msg = isFoul
    ? "💀 What is that smell?!"
    : type === "antiseptic"
    ? "😷 That antiseptic smell!"
    : "😊 Sweet fruity smell!";
  const faceColor = isFoul ? "#fde68a" : type === "antiseptic" ? "#e0e7ff" : "#fce7f3";
  const borderColor = isFoul ? "border-lime-300" : type === "antiseptic" ? "border-indigo-300" : "border-pink-300";
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <motion.div
            className={`bg-white rounded-2xl shadow-2xl p-3 border-2 ${borderColor} relative overflow-hidden`}
            animate={isFoul ? { rotate: [0, -2, 2, -1, 1, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="flex flex-col items-center">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill={faceColor} stroke="#d1d5db" strokeWidth="1.5" />
                {isFoul ? (
                  <>
                    <path d="M16 20 Q20 17 24 20" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M32 20 Q36 17 40 20" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <ellipse cx="28" cy="38" rx="7" ry="4" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
                    <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                      <ellipse cx="28" cy="30" rx="12" ry="5" fill={faceColor} stroke="#d1d5db" strokeWidth="0.8" />
                    </motion.g>
                  </>
                ) : (
                  <>
                    <circle cx="20" cy="22" r="2" fill="#1f2937" />
                    <circle cx="36" cy="22" r="2" fill="#1f2937" />
                    <path d="M20 34 Q28 42 36 34" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </>
                )}
              </svg>
              <motion.div
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg mt-1 ${isFoul ? "bg-lime-100 text-lime-800" : "bg-pink-100 text-pink-800"}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                {msg}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Sound Toggle Button ─────────────────────────────────────────────────────
export function SoundToggle() {
  const [on, setOn] = useState(true);
  return (
    <button
      onClick={() => setOn(sfx.toggle())}
      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      title={on ? "Mute" : "Unmute"}
    >
      {on ? <Volume2 className="w-5 h-5 text-gray-500" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
    </button>
  );
}
