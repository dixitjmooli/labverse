"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { ArrowLeft, ChevronRight, FlaskConical, BookOpen } from "lucide-react";
import { CLASS_META, SUBJECTS, getExperimentsForSubject } from "@/lib/syllabus-utils";

export default function SubjectPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params);
  const cls = CLASS_META.find((c) => c.id === classId);
  if (!cls) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
          <Link href="/" className="p-1.5 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
          </Link>
          <span className="text-3xl">{cls.emoji}</span>
          <div>
            <h1 className="font-black text-gray-800 text-sm sm:text-base leading-tight">{cls.label}</h1>
            <p className="text-[10px] text-gray-400">Choose a subject</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <h2 className="text-2xl font-black text-gray-800">Subjects</h2>
          <p className="text-sm text-gray-400">Pick a subject to browse chapters and experiments.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cls.subjects.map((subjId, i) => {
            const subj = SUBJECTS.find((s) => s.id === subjId)!;
            const expCount = getExperimentsForSubject(cls.id, subj.id).length;
            return (
              <motion.div
                key={subj.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <Link
                  href={`/class-${cls.id}/${subj.id}`}
                  className="group block bg-white rounded-2xl p-5 shadow-md hover:shadow-xl border border-gray-100 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <motion.div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subj.gradient} flex items-center justify-center shadow-md`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <span className="text-2xl">{subj.emoji}</span>
                    </motion.div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-black text-gray-800">{subj.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-gray-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      NCERT chapters
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className={`flex items-center gap-1 font-semibold ${expCount > 0 ? "text-emerald-600" : "text-gray-400"}`}>
                      <FlaskConical className="w-3 h-3" />
                      {expCount > 0 ? `${expCount} live experiment${expCount === 1 ? "" : "s"}` : "Coming soon"}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
