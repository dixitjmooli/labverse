"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  Beaker,
  TestTube2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Award,
  ChevronRight,
  Eye,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import type { TestDef, ReactionResult, ReactionVisual } from "@/lib/lab-types";
import type { ExperimentManifest } from "@/lib/lab-types";
import { sfx, playReactionSound } from "@/lib/sound-engine";
import { TestTubeVisual, ReagentBottle, type TubeState } from "./TestTube";
import { StudentReaction, SoundToggle } from "./VisualEffects";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function shuffleArr<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

// Pre-fill color for unknown samples (water-like, colorless liquid in tube)
const SAMPLE_LIQUID_COLOR = "rgba(219,234,254,0.55)"; // very faint blue tint — looks like a clear aqueous sample
const SAMPLE_DESCRIPTION = "Unknown sample — add reagents to test.";

function createTubes(test: TestDef): TubeState[] {
  const types = shuffleArr(test.unknownTypes);
  return types.map((t, i) => {
    const baseReaction = test.getReactionMulti
      ? test.getReactionMulti(t, [])
      : test.getReaction(t, false, false);
    return {
      id: String.fromCharCode(65 + i), // A, B, C, D...
      unknownType: t,
      addedReagentIds: [],
      // Tube starts pre-filled with the unknown sample.
      // Respect the experiment's initial description/liquidColor if it provided one
      // (so e.g. Reaction Type Detective can show "Reactants: Fe + CuSO₄ (blue)"
      // and a blue liquid before any trigger is added). Fall back to the default
      // "Unknown sample" behaviour for legacy experiments.
      reaction: {
        ...baseReaction,
        liquidColor:
          baseReaction.liquidColor && baseReaction.liquidColor !== "transparent"
            ? baseReaction.liquidColor
            : SAMPLE_LIQUID_COLOR,
        description: baseReaction.description || SAMPLE_DESCRIPTION,
      },
      liquidLevel: 1, // pre-filled with sample
      fizzing: false,
      stinking: false,
    };
  });
}

type GamePhase = "intro" | "experiment" | "identify" | "results";

// ─── Main Player Component ───────────────────────────────────────────────────
// Generic — works for ANY TestDef. Each experiment module just passes its own
// TestDef + manifest into this component.

export function ExperimentPlayer({
  test,
  manifest,
}: {
  test: TestDef;
  manifest: ExperimentManifest;
}) {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [tubes, setTubes] = useState<TubeState[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const start = useCallback(() => {
    setTubes(createTubes(test));
    setPhase("experiment");
  }, [test]);
  const identify = useCallback(() => setPhase("identify"), []);
  const submit = useCallback((a: Record<string, string>) => {
    setAnswers(a);
    setPhase("results");
  }, []);
  const reset = useCallback(() => {
    setPhase("intro");
    setTubes([]);
    setAnswers({});
  }, []);
  const back = useCallback(() => {
    if (phase === "experiment") setPhase("intro");
  }, [phase]);

  const backHref = `/class/${manifest.classId}/${manifest.subjectId}/${manifest.chapterSlug}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/30 to-teal-50/50">
      {/* Top bar with breadcrumb back to chapter */}
      <div className="absolute top-3 left-3 z-50">
        <Link
          href={backHref}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {manifest.chapterSlug.replace(/-/g, " ")}
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <IntroScreen test={test} onStart={start} />
          </motion.div>
        )}
        {phase === "experiment" && (
          <motion.div key="exp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ExperimentScreen test={test} tubes={tubes} setTubes={setTubes} onIdentify={identify} onBack={back} />
          </motion.div>
        )}
        {phase === "identify" && (
          <motion.div key="id" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <IdentifyScreen test={test} tubes={tubes} onSubmit={submit} />
          </motion.div>
        )}
        {phase === "results" && (
          <motion.div key="res" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ResultsScreen test={test} tubes={tubes} answers={answers} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Intro Screen ────────────────────────────────────────────────────────────
function IntroScreen({ test, onStart }: { test: TestDef; onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-y-auto p-4">
      <div className="max-w-lg mx-auto py-12">
        <motion.div className="text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <motion.div
            className={`mx-auto mb-4 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br ${test.gradient}`}
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            <span className="text-3xl">{test.emoji}</span>
          </motion.div>
          <h1 className="text-3xl font-black text-gray-800 mb-1">{test.name}</h1>
          <p className="text-sm text-gray-400 mb-8">{test.desc}</p>

          <div className="bg-white/90 rounded-2xl p-5 mb-5 shadow-lg text-left">
            <h2 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" /> How It Works
            </h2>
            <div className="space-y-3">
              {test.introSteps.map((s, i) => (
                <div key={i} className="flex gap-3 items-start text-sm">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
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

          <div className="bg-white/90 rounded-2xl p-5 mb-8 shadow-lg text-left">
            <h2 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" /> Reaction Key
            </h2>
            <div className="space-y-2">
              {test.reactionKey.map((k, i) => (
                <div key={i} className={`p-2.5 rounded-xl ${k.color}`}>
                  <span className={`font-black text-sm ${k.textColor}`}>{k.type}:</span>
                  {k.results.map((r, j) => (
                    <p key={j} className={`text-xs ${k.textColor} ml-4`}>
                      {r}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <motion.button
            onClick={onStart}
            className={`px-8 py-3.5 bg-gradient-to-r ${test.gradient} text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            Enter the Lab <ChevronRight className="inline w-5 h-5 ml-1" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Reagent Bank (renders flat OR grouped by `category`) ────────────────────
// When ANY reagent has a `category` field, reagents are rendered in labelled
// sections (one per unique category, in array order). Otherwise a flat row
// is rendered — keeping every existing 2-reagent experiment unchanged.

const CATEGORY_META: Record<string, { label: string; emoji: string; sublabel: string }> = {
  natural:    { label: "Natural",    emoji: "🌿", sublabel: "From living things" },
  synthetic:  { label: "Synthetic",  emoji: "🧪", sublabel: "Lab-made dyes" },
  olfactory:  { label: "Olfactory",  emoji: "👃", sublabel: "Smell-based" },
};

function ReagentBank({
  test,
  sel,
  setSel,
}: {
  test: TestDef;
  sel: number | null;
  setSel: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const hasCategories = test.reagents.some((r) => r.category);

  if (!hasCategories) {
    return (
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center max-w-3xl mx-auto">
        {test.reagents.map((r, i) => (
          <ReagentBottle key={r.id} reagent={r} selected={sel === i} onClick={() => setSel(sel === i ? null : i)} />
        ))}
      </div>
    );
  }

  // Unique categories in array order (so the experiment author controls order)
  const categories: string[] = [];
  for (const r of test.reagents) {
    if (r.category && !categories.includes(r.category)) categories.push(r.category);
  }

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        return (
          <div key={cat} className="bg-white/60 rounded-2xl px-3 py-2.5 border border-gray-100 shadow-sm">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-xs">{meta?.emoji ?? "•"}</span>
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                {meta?.label ?? cat}
              </span>
              {meta?.sublabel && (
                <span className="text-[9px] text-gray-400 font-medium">— {meta.sublabel}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {test.reagents.map((r, i) =>
                r.category === cat ? (
                  <ReagentBottle
                    key={r.id}
                    reagent={r}
                    selected={sel === i}
                    onClick={() => setSel(sel === i ? null : i)}
                  />
                ) : null
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Experiment Screen ───────────────────────────────────────────────────────
function ExperimentScreen({ test, tubes, setTubes, onIdentify, onBack }: {
  test: TestDef;
  tubes: TubeState[];
  setTubes: React.Dispatch<React.SetStateAction<TubeState[]>>;
  onIdentify: () => void;
  onBack: () => void;
}) {
  const [sel, setSel] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(true);
  const [smellReaction, setSmellReaction] = useState<"foul" | "fruity" | "antiseptic" | null>(null);
  const tubeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const anyAdded = tubes.some((t) => t.addedReagentIds.length > 0);

  const handleAdd = useCallback(
    (tubeId: string) => {
      if (sel === null) return;
      const selectedReagent = test.reagents[sel];
      if (!selectedReagent) return;
      sfx.playDrop();
      setTimeout(() => sfx.playPour(), 150);
      setTimeout(() => {
        setTubes((prev) =>
          prev.map((t) => {
            if (t.id !== tubeId) return t;
            // Append reagent id (dedupe — adding the same reagent twice is a no-op)
            const newAdded = t.addedReagentIds.includes(selectedReagent.id)
              ? t.addedReagentIds
              : [...t.addedReagentIds, selectedReagent.id];
            const reaction = test.getReactionMulti
              ? test.getReactionMulti(t.unknownType, newAdded)
              : test.getReaction(
                  t.unknownType,
                  newAdded.includes(test.reagents[0]?.id),
                  newAdded.includes(test.reagents[1]?.id)
                );
            // Tube starts pre-filled (level 1). Each added reagent raises level by 1, capped at 3.
            const newLevel = Math.min(3, 1 + newAdded.length);
            const willFizz = [
              "precipitate",
              "color-change",
              "effervescence",
              "foul-smell",
              "fruity-smell",
              "antiseptic-smell",
              "silver-mirror",
              "decolorize",
              "dye",
            ].includes(reaction.visual);
            const isSmell =
              reaction.visual === "foul-smell" ||
              reaction.visual === "fruity-smell" ||
              reaction.visual === "antiseptic-smell" ||
              !!reaction.smellType;
            setTimeout(() => playReactionSound(reaction.visual as ReactionVisual, reaction.smellType), 100);
            if (isSmell) {
              const smell =
                reaction.smellType ||
                (reaction.visual === "foul-smell"
                  ? "foul"
                  : reaction.visual === "fruity-smell"
                  ? "fruity"
                  : "antiseptic") as "foul" | "fruity" | "antiseptic";
              setSmellReaction(smell);
              setTimeout(() => setSmellReaction(null), 4000);
            }
            return { ...t, addedReagentIds: newAdded, reaction, liquidLevel: newLevel, fizzing: willFizz, stinking: isSmell };
          })
        );
      }, 400);
      setTimeout(() => {
        setTubes((prev) => prev.map((t) => ({ ...t, fizzing: false })));
      }, 2500);
    },
    [sel, test, setTubes]
  );

  useEffect(() => {
    if (anyAdded && showHelp) {
      const t = setTimeout(() => setShowHelp(false), 5000);
      return () => clearTimeout(t);
    }
  }, [anyAdded, showHelp]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/30 to-teal-50/50 flex flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-3 py-2.5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 text-gray-400" />
            </button>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${test.gradient}`}>
              <span className="text-sm">{test.emoji}</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800 leading-tight">{test.name}</h1>
              <p className="text-[9px] text-gray-400">{test.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SoundToggle />
            {anyAdded && (
              <motion.button
                onClick={onIdentify}
                className={`px-4 py-1.5 bg-gradient-to-r ${test.gradient} text-white font-bold text-xs rounded-xl shadow-lg`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Identify <ChevronRight className="inline w-3 h-3" />
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 max-w-5xl mx-auto w-full">
        <AnimatePresence>
          {showHelp && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4 w-full max-w-md">
              <div className="bg-white border border-emerald-200 rounded-xl px-4 py-3 text-center text-xs shadow-md">
                {sel === null
                  ? "👆 Select an indicator bottle, then click a sample tube to add it"
                  : `🧪 Click a sample tube to add ${test.reagents[sel]?.name ?? "the selected reagent"}`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6 w-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Indicators &amp; Reagents</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <ReagentBank test={test} sel={sel} setSel={setSel} />
        </div>

        <div className="mb-6 w-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Unknown Samples</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="flex gap-4 sm:gap-8 justify-center items-start">
            {tubes.map((tube) => (
              <TestTubeVisual
                key={tube.id}
                tube={tube}
                test={test}
                onClick={() => handleAdd(tube.id)}
                active={sel !== null}
                tubeRef={(el) => {
                  tubeRefs.current[tube.id] = el;
                }}
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-lg bg-white/90 rounded-2xl p-4 shadow-xl border border-gray-100">
          <h3 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Beaker className="w-3.5 h-3.5 text-emerald-500" /> Observations
          </h3>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
            {tubes.every((t) => t.addedReagentIds.length === 0) ? (
              tubes.map((tube) => (
                <div key={tube.id} className="flex gap-2 text-xs p-2 rounded-lg bg-slate-50">
                  <TestTube2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-300" />
                  <span className="text-slate-400">
                    <b>Sample {tube.id}:</b> {tube.reaction.description}
                  </span>
                </div>
              ))
            ) : (
              tubes.map(
                (tube) =>
                  tube.addedReagentIds.length > 0 &&
                  tube.reaction.description && (
                    <motion.div
                      key={tube.id + tube.reaction.description}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-2 text-xs p-2 rounded-lg ${tube.stinking ? "bg-lime-50" : "bg-gray-50"}`}
                    >
                      <TestTube2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${tube.stinking ? "text-lime-500" : "text-gray-400"}`} />
                      <span>
                        <b>Sample {tube.id}:</b> {tube.reaction.description}
                      </span>
                    </motion.div>
                  )
              )
            )}
          </div>
        </div>
      </main>

      <StudentReaction show={!!smellReaction} type={smellReaction} />
    </div>
  );
}

// ─── Identify Screen ─────────────────────────────────────────────────────────
function IdentifyScreen({ test, tubes, onSubmit }: { test: TestDef; tubes: TubeState[]; onSubmit: (a: Record<string, string>) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const handleSelect = (tubeId: string, type: string) => {
    const a = { ...answers, [tubeId]: type };
    Object.keys(a).forEach((k) => {
      if (k !== tubeId && a[k] === type) delete a[k];
    });
    setAnswers(a);
  };
  const allSelected = tubes.every((t) => answers[t.id]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col p-4">
      <div className="max-w-lg mx-auto w-full flex flex-col items-center justify-center flex-1 py-12">
        <motion.div className="w-full text-center mb-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h2 className="text-2xl font-black text-gray-800">Identify the Unknowns</h2>
          <p className="text-sm text-gray-400">Assign each tube its correct type based on observations.</p>
        </motion.div>
        <div className="w-full space-y-4 mb-8">
          {tubes.map((tube, i) => (
            <motion.div
              key={tube.id}
              className="bg-white/90 rounded-2xl p-4 shadow-lg border border-gray-100"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-black text-gray-800 text-lg">Sample {tube.id}</h3>
                {answers[tube.id] && (
                  <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold">{answers[tube.id]}</span>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-2 mb-3 text-[11px] text-gray-500 flex items-start gap-1.5">
                <TestTube2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                {tube.reaction.description || "No reagents added."}
              </div>
              <div className="flex gap-2">
                {test.unknownTypes.map((type) => {
                  const isSel = answers[tube.id] === type;
                  return (
                    <motion.button
                      key={type}
                      onClick={() => handleSelect(tube.id, type)}
                      className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
                        isSel ? `bg-gradient-to-r ${test.gradient} text-white shadow-lg` : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: isSel ? 1 : 1.03 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {type}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.button
          onClick={() => onSubmit(answers)}
          disabled={!allSelected}
          className={`w-full py-3.5 rounded-2xl font-bold text-lg shadow-xl transition-all ${
            allSelected ? `bg-gradient-to-r ${test.gradient} text-white shadow-emerald-300/40 hover:shadow-2xl` : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          whileHover={allSelected ? { scale: 1.02, y: -2 } : {}}
          whileTap={allSelected ? { scale: 0.98 } : {}}
        >
          {allSelected ? "Submit Answers" : "Assign all tubes to continue"}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Results Screen ──────────────────────────────────────────────────────────
function ResultsScreen({ test, tubes, answers, onReset }: { test: TestDef; tubes: TubeState[]; answers: Record<string, string>; onReset: () => void }) {
  const correct = tubes.filter((t) => answers[t.id] === t.unknownType).length;
  const total = tubes.length;
  const perfect = correct === total;
  useEffect(() => {
    if (perfect) sfx.playSuccess();
    else sfx.playError();
  }, [perfect]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full text-center py-12">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, delay: 0.3 }}>
          {perfect ? (
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-200/60 relative">
              <Award className="w-12 h-12 text-white" />
            </div>
          ) : (
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-2xl ${correct >= 2 ? "bg-gradient-to-br from-emerald-400 to-teal-500" : "bg-gradient-to-br from-orange-400 to-red-500"}`}>
              <span className="text-3xl font-black text-white">
                {correct}/{total}
              </span>
            </div>
          )}
        </motion.div>

        <h2 className="text-3xl font-black text-gray-800 mt-4 mb-2">{perfect ? "Perfect Score!" : correct >= 2 ? "Great Job!" : "Keep Practicing!"}</h2>
        <p className="text-gray-400 mb-6">{perfect ? "All correct!" : `${correct} out of ${total} correct.`}</p>

        <div className="space-y-3 mb-6">
          {tubes.map((tube, i) => {
            const isCorrect = answers[tube.id] === tube.unknownType;
            return (
              <motion.div
                key={tube.id}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 shadow-sm ${isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCorrect ? "bg-emerald-500" : "bg-red-500"}`}>
                  {isCorrect ? <CheckCircle2 className="w-6 h-6 text-white" /> : <XCircle className="w-6 h-6 text-white" />}
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">Sample {tube.id}</div>
                  <div className="text-xs text-gray-500">
                    Your answer: <span className={`font-bold ${isCorrect ? "text-emerald-600" : "text-red-600"}`}>{answers[tube.id]}</span>
                    {!isCorrect && (
                      <>
                        {" → "}
                        <span className="font-bold text-emerald-600">{tube.unknownType}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-white/90 rounded-2xl p-4 mb-6 shadow-lg text-left">
          <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-emerald-500" /> Quick Recap
          </h3>
          <div className="space-y-2 text-xs text-gray-600">
            {test.recap.map((r, i) => (
              <p key={i}>{r}</p>
            ))}
          </div>
        </div>

        <motion.button
          onClick={onReset}
          className={`px-8 py-3.5 bg-gradient-to-r ${test.gradient} text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <RotateCcw className="inline w-5 h-5 mr-2" /> Try Again
        </motion.button>
      </div>
    </div>
  );
}

// Re-export FlaskConical for the home page icon
export { FlaskConical };
