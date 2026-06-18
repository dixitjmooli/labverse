"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { ArrowLeft, ChevronRight, FlaskConical, BookOpen, Lock, Sparkles } from "lucide-react";
import { CLASS_META, SUBJECTS, getChaptersWithStatus } from "@/lib/syllabus-utils";

export default function ChapterPage({
  params,
}: {
  params: Promise<{ classId: string; subjectId: string }>;
}) {
  const { classId, subjectId } = use(params);
  const cls = CLASS_META.find((c) => c.id === classId);
  const subj = SUBJECTS.find((s) => s.id === subjectId);
  if (!cls || !subj) return notFound();

  const chapters = getChaptersWithStatus(cls.id, subj.id);
  const liveCount = chapters.filter((c) => c.hasExperiments).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-fuchsia-50/40">
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
          <Link href={`/class-${cls.id}`} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
          </Link>
          <motion.div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${subj.gradient} flex items-center justify-center`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <span className="text-base">{subj.emoji}</span>
          </motion.div>
          <div>
            <h1 className="font-black text-gray-800 text-sm sm:text-base leading-tight">{subj.name}</h1>
            <p className="text-[10px] text-gray-400">
              {cls.label} · {chapters.length} chapters · {liveCount} with experiments
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <h2 className="text-2xl font-black text-gray-800">Chapters</h2>
          <p className="text-sm text-gray-400">
            Tap any chapter to see available experiments. Chapters marked{" "}
            <span className="text-gray-500 font-semibold">Coming Soon</span> are queued for development.
          </p>
        </motion.div>

        <div className="space-y-2.5">
          {chapters.map((ch, i) => (
            <motion.div
              key={ch.slug}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={`/class-${cls.id}/${subj.id}/${ch.slug}`}
                className="group flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg border border-gray-100 transition-all"
              >
                <div
                  className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm ${
                    ch.hasExperiments
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {ch.hasExperiments ? <FlaskConical className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm leading-tight truncate">
                    <span className="text-gray-400 mr-2 font-mono text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {ch.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {ch.hasExperiments ? (
                      <>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-100">
                          {ch.experimentCount} experiment{ch.experimentCount === 1 ? "" : "s"}
                        </span>
                        <span className="text-[10px] text-indigo-500 flex items-center gap-0.5 font-semibold">
                          <Sparkles className="w-3 h-3" /> Live
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full font-bold border border-gray-100">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <BookOpen className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
          <p className="text-xs text-gray-600">
            Missing an experiment? Suggest one — every chapter can grow independently.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
