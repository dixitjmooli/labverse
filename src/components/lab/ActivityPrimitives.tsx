"use client";

// ─── Activity Primitives ─────────────────────────────────────────────────────
// Reusable building blocks for bespoke, scene-based NCERT activities.
// Each activity composes these primitives + its own dedicated SVG scene.
//
// Generic shape:
//   <ActivityShell manifest phase onReset>
//     {phase === "intro"     && <ActivityIntro ... />}
//     {phase === "scene"     && <MyCustomScene /> + <ActivityStepHeader ... />}
//     {phase === "classify"  && <ActivityClassify ... />}
//     {phase === "results"   && <ActivityResults ... />}
//   </ActivityShell>

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Eye,
  FlaskConical,
} from "lucide-react";
import { useEffect } from "react";
import type { ExperimentManifest } from "@/lib/lab-types";
import { SoundToggle } from "./VisualEffects";
import { sfx } from "@/lib/sound-engine";

// ─── Shell (background + top bar + sound toggle) ─────────────────────────────

export function ActivityShell({
  manifest,
  children,
}: {
  manifest: ExperimentManifest;
  children: React.ReactNode;
}) {
  const backHref = `/class/${manifest.classId}/${manifest.subjectId}/${manifest.chapterSlug}`;
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-amber-50/30 to-orange-50/50">
      <div className="absolute top-3 left-3 z-50">
        <Link
          href={backHref}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {manifest.chapterSlug.replace(/-/g, " ")}
        </Link>
      </div>
      <div className="absolute top-3 right-3 z-50">
        <SoundToggle />
      </div>
      {children}
    </div>
  );
}

// ─── Intro Screen ────────────────────────────────────────────────────────────

export interface ActivityIntroStep {
  title: string;
  desc: string;
}

export function ActivityIntro({
  emoji,
  gradient,
  name,
  desc,
  steps,
  safetyNotes,
  onStart,
}: {
  emoji: string;
  gradient: string;
  name: string;
  desc: string;
  steps: ActivityIntroStep[];
  safetyNotes?: string[];
  onStart: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 overflow-y-auto p-4">
      <div className="max-w-lg mx-auto py-12">
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.div
            className={`mx-auto mb-4 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br ${gradient}`}
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            <span className="text-3xl">{emoji}</span>
          </motion.div>
          <h1 className="text-3xl font-black text-gray-800 mb-1">{name}</h1>
          <p className="text-sm text-gray-400 mb-8">{desc}</p>

          <div className="bg-white/90 rounded-2xl p-5 mb-5 shadow-lg text-left">
            <h2 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" /> How To Perform
            </h2>
            <div className="space-y-3">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-3 items-start text-sm">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-700">{s.title}</p>
                    <p className="text-gray-500 text-xs">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {safetyNotes && safetyNotes.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-8 shadow-lg text-left">
              <h2 className="font-bold text-rose-700 mb-3 flex items-center gap-2">
                ⚠️ Safety Notes
              </h2>
              <ul className="space-y-1.5">
                {safetyNotes.map((note, i) => (
                  <li key={i} className="text-xs text-rose-600 flex gap-2">
                    <span className="font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <motion.button
            onClick={onStart}
            className={`px-8 py-3.5 bg-gradient-to-r ${gradient} text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            Begin Activity <ChevronRight className="inline w-5 h-5 ml-1" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Scene Header (top bar with activity name + step indicator) ──────────────

export function ActivityHeader({
  emoji,
  gradient,
  name,
  category,
  stepNumber,
  totalSteps,
  onReset,
}: {
  emoji: string;
  gradient: string;
  name: string;
  category: string;
  stepNumber: number;
  totalSteps: number;
  onReset: () => void;
}) {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-3 py-2.5 sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="p-1.5 rounded-lg hover:bg-gray-100" title="Restart">
            <RotateCcw className="w-4 h-4 text-gray-400" />
          </button>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${gradient}`}>
            <span className="text-sm">{emoji}</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight">{name}</h1>
            <p className="text-[9px] text-gray-400">{category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < stepNumber ? "bg-amber-500 w-4" : i === stepNumber ? "bg-amber-400 w-6" : "bg-gray-200 w-3"
              }`}
            />
          ))}
          <span className="ml-1 text-[10px] font-bold text-gray-400">
            {stepNumber + 1}/{totalSteps}
          </span>
        </div>
      </div>
    </header>
  );
}

// ─── Step Header (current step instruction) ──────────────────────────────────

export function ActivityStepHeader({
  stepNumber,
  totalSteps,
  title,
  instruction,
}: {
  stepNumber: number;
  totalSteps: number;
  title: string;
  instruction: string;
}) {
  return (
    <motion.div
      key={stepNumber}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-amber-200 rounded-xl px-4 py-3 text-center shadow-md w-full max-w-lg"
    >
      <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">
        Step {stepNumber} of {totalSteps}
      </div>
      <p className="font-bold text-gray-800 text-sm mb-1">{title}</p>
      <p className="text-xs text-gray-500">{instruction}</p>
    </motion.div>
  );
}

// ─── Tool Button ─────────────────────────────────────────────────────────────

export function ToolButton({
  emoji,
  label,
  onClick,
  disabled,
  highlighted,
}: {
  emoji: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  highlighted?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all ${
        disabled
          ? "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
          : highlighted
          ? "bg-amber-50 border-amber-400 shadow-lg cursor-pointer hover:scale-105"
          : "bg-white border-gray-200 shadow-sm cursor-pointer hover:scale-105 hover:border-amber-300"
      }`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{label}</span>
    </motion.button>
  );
}

// ─── Observation Banner ──────────────────────────────────────────────────────

export function ObservationBanner({
  text,
  variant = "info",
}: {
  text: string;
  variant?: "info" | "success" | "warning";
}) {
  const colors = {
    info: "bg-sky-50 border-sky-200 text-sky-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    warning: "bg-rose-50 border-rose-200 text-rose-800",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl px-4 py-3 text-xs font-medium shadow-sm w-full max-w-lg ${colors[variant]}`}
    >
      <Eye className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
      {text}
    </motion.div>
  );
}

// ─── Classify Card (multiple choice) ─────────────────────────────────────────

export function ActivityClassify({
  question,
  options,
  onSelect,
  selected,
  title = "Classify the Reaction",
}: {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
  selected: string | null;
  title?: string;
}) {
  return (
    <div className="max-w-lg mx-auto w-full px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/95 rounded-2xl p-6 shadow-xl border border-gray-100"
      >
        <h2 className="text-xl font-black text-gray-800 mb-2 text-center">{title}</h2>
        <p className="text-sm text-gray-500 mb-5 text-center">{question}</p>
        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => {
            const isSel = selected === opt;
            return (
              <motion.button
                key={opt}
                onClick={() => onSelect(opt)}
                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 ${
                  isSel
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent shadow-lg"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-amber-300 hover:bg-amber-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Results Card ────────────────────────────────────────────────────────────

export function ActivityResults({
  correct,
  selectedAnswer,
  correctAnswer,
  equation,
  recap,
  gradient,
  onReset,
}: {
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  equation: string;
  recap: string[];
  gradient: string;
  onReset: () => void;
}) {
  useEffect(() => {
    if (correct) sfx.playSuccess();
    else sfx.playError();
  }, [correct]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full text-center py-12">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          {correct ? (
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-200/60">
              <Award className="w-12 h-12 text-white" />
            </div>
          ) : (
            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-br from-orange-400 to-red-500">
              <span className="text-4xl">📚</span>
            </div>
          )}
        </motion.div>

        <h2 className="text-3xl font-black text-gray-800 mt-4 mb-2">
          {correct ? "Perfect!" : "Good Try!"}
        </h2>
        <p className="text-gray-400 mb-4">
          {correct
            ? "You classified the reaction correctly."
            : "Review the answer below and try again."}
        </p>

        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 shadow-sm mb-4 ${
            correct ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${correct ? "bg-emerald-500" : "bg-red-500"}`}>
            {correct ? <CheckCircle2 className="w-6 h-6 text-white" /> : <XCircle className="w-6 h-6 text-white" />}
          </div>
          <div className="text-left text-xs">
            <div className="text-gray-500">
              Your answer: <span className={`font-bold ${correct ? "text-emerald-600" : "text-red-600"}`}>{selectedAnswer}</span>
            </div>
            {!correct && (
              <div className="text-gray-500">
                Correct: <span className="font-bold text-emerald-600">{correctAnswer}</span>
              </div>
            )}
          </div>
        </motion.div>

        <div className="bg-white/90 rounded-2xl p-4 mb-4 shadow-lg text-left">
          <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2 text-sm">
            <FlaskConical className="w-4 h-4 text-amber-500" /> Balanced Equation
          </h3>
          <p className="text-center text-base font-mono font-bold text-gray-800 py-2 bg-amber-50 rounded-lg">
            {equation}
          </p>
        </div>

        <div className="bg-white/90 rounded-2xl p-4 mb-6 shadow-lg text-left">
          <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-amber-500" /> Quick Recap
          </h3>
          <div className="space-y-2 text-xs text-gray-600">
            {recap.map((r, i) => (
              <p key={i}>{r}</p>
            ))}
          </div>
        </div>

        <motion.button
          onClick={onReset}
          className={`px-8 py-3.5 bg-gradient-to-r ${gradient} text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <RotateCcw className="inline w-5 h-5 mr-2" /> Try Again
        </motion.button>
      </div>
    </div>
  );
}

// ─── Scene Container (the workbench / lab bench background) ──────────────────

export function SceneContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-200 ${className}`}
      style={{ aspectRatio: "4 / 3", background: "linear-gradient(to bottom, #fef3c7 0%, #fef3c7 55%, #d4a574 55%, #b8845e 100%)" }}
    >
      {children}
    </div>
  );
}

// ─── Continue / Next Step Button ─────────────────────────────────────────────

export function ContinueButton({
  onClick,
  label = "Continue",
  gradient = "from-amber-400 to-orange-500",
}: {
  onClick: () => void;
  label?: string;
  gradient?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-6 py-2.5 bg-gradient-to-r ${gradient} text-white font-bold text-sm rounded-xl shadow-lg`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label} <ChevronRight className="inline w-4 h-4 ml-1" />
    </motion.button>
  );
}
