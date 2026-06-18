"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  FlaskConical,
  Sparkles,
  Lock,
  BookOpen,
  Wand2,
} from "lucide-react";
import { CLASS_META, SUBJECTS, getChapters } from "@/lib/syllabus-utils";
import { getExperimentsForChapter } from "@/experiments/registry";

export default function ExperimentListPage({
  params,
}: {
  params: Promise<{ classId: string; subjectId: string; chapterSlug: string }>;
}) {
  const { classId, subjectId, chapterSlug } = use(params);
  const cls = CLASS_META.find((c) => c.id === classId);
  const subj = SUBJECTS.find((s) => s.id === subjectId);
  const chapters = getChapters(classId, subjectId);
  const chapterIdx = chapters.findIndex((c) => c.slug === chapterSlug);
  if (!cls || !subj || chapterIdx === -1) return notFound();
  const chapter = chapters[chapterIdx];

  const experiments = getExperimentsForChapter(classId, subjectId, chapterSlug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50">
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
          <Link href={`/class-${cls.id}/${subj.id}`} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
          </Link>
          <motion.div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${subj.gradient} flex items-center justify-center`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <span className="text-base">{subj.emoji}</span>
          </motion.div>
          <div className="min-w-0 flex-1">
            <h1 className="font-black text-gray-800 text-sm sm:text-base leading-tight truncate">
              <span className="text-gray-400 mr-1.5 font-mono text-xs">
                {String(chapterIdx + 1).padStart(2, "0")}
              </span>
              {chapter.name}
            </h1>
            <p className="text-[10px] text-gray-400">
              {cls.label} · {subj.name} · {experiments.length} experiment{experiments.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <h2 className="text-2xl font-black text-gray-800">Experiments</h2>
          <p className="text-sm text-gray-400">
            {experiments.length > 0
              ? "Pick an experiment to enter the virtual lab."
              : "No experiments built yet — this chapter is on the roadmap."}
          </p>
        </motion.div>

        {experiments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {experiments.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <Link
                  href={`/class-${cls.id}/${subj.id}/${chapterSlug}/${exp.id}`}
                  className="group block bg-white rounded-2xl p-5 shadow-md hover:shadow-2xl border border-gray-100 transition-all overflow-hidden relative"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${exp.gradient}`} />
                  <div className="flex items-start justify-between mb-3">
                    <motion.div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exp.gradient} flex items-center justify-center shadow-md`}
                      whileHover={{ scale: 1.1, rotate: -5 }}
                    >
                      <span className="text-2xl">{exp.emoji}</span>
                    </motion.div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-black text-gray-800 text-base leading-tight">{exp.title}</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-snug line-clamp-3">{exp.blurb}</p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ~{exp.durationMin} min
                    </span>
                    <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3 h-3" />
                      Interactive
                    </span>
                    <span className="ml-auto text-[10px] text-indigo-500 flex items-center gap-0.5 font-bold">
                      <FlaskConical className="w-3 h-3" />
                      Start
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <ComingSoonCard chapterName={chapter.name} />
        )}

        {/* Other chapters quick nav */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Other chapters in {subj.name}
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {chapters.map((c, idx) => {
              const isCurrent = c.slug === chapterSlug;
              return (
                <Link
                  key={c.slug}
                  href={`/class-${cls.id}/${subj.id}/${c.slug}`}
                  className={`flex-shrink-0 text-xs px-3 py-2 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-gray-800 text-white border-gray-800"
                      : "bg-white text-gray-500 border-gray-100 hover:border-indigo-200 hover:text-indigo-600"
                  }`}
                >
                  <span className="font-mono opacity-50 mr-1.5">{String(idx + 1).padStart(2, "0")}</span>
                  {c.name.length > 24 ? c.name.slice(0, 22) + "…" : c.name}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ComingSoonCard({ chapterName }: { chapterName: string }) {
  return (
    <motion.div
      className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-dashed border-gray-200 text-center"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <motion.div
        className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner"
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <Lock className="w-9 h-9 text-gray-400" />
      </motion.div>
      <h3 className="text-xl font-black text-gray-700 mb-1">Coming Soon</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
        No interactive experiments have been built for{" "}
        <span className="font-bold text-gray-700">{chapterName}</span> yet. This chapter is on the
        roadmap — experiments are added incrementally without disrupting others.
      </p>
      <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-full border border-indigo-100">
        <Wand2 className="w-3.5 h-3.5 text-indigo-500" />
        <span className="text-xs text-indigo-700 font-semibold">In development</span>
      </div>
      <p className="text-[10px] text-gray-400 mt-6">
        Teachers: use this gap to assign the chapter as pre-reading. Students: check back soon!
      </p>
    </motion.div>
  );
}
