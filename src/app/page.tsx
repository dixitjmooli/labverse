"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FlaskConical, GraduationCap, Sparkles, ChevronRight, Github, BookOpen } from "lucide-react";
import { CLASS_META, getExperimentsForClass } from "@/lib/syllabus-utils";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/50 overflow-y-auto">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
            >
              <FlaskConical className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="font-black text-gray-800 leading-tight text-sm sm:text-base">LabVerse</h1>
              <p className="text-[10px] text-gray-400 leading-tight">Interactive Experiments for Classes 9 – 12</p>
            </div>
          </div>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-gray-700 transition-colors"
            title="View on GitHub"
          >
            <Github className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-indigo-100 text-xs text-indigo-600 font-semibold mb-4 shadow-sm"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            CBSE 2024-25 Syllabus · Aligned with NCERT
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-800 mb-3">
            Practise Experiments <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">Like a Real Lab</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mb-2">
            A teaching aid for teachers. A visual playground for students. Add reagents, observe reactions, identify unknowns — all in your browser.
          </p>
          <p className="text-gray-400 text-xs">
            Pick a class to begin · {CLASS_META.length} classes · {CLASS_META.reduce((a, c) => a + c.subjects.length, 0)} subjects · 14 chapters with live experiments
          </p>
        </motion.div>
      </section>

      {/* Class grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CLASS_META.map((cls, i) => {
            const expCount = getExperimentsForClass(cls.id).length;
            return (
              <motion.div
                key={cls.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <Link
                  href={`/class/${cls.id}`}
                  className="group block bg-white rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden transition-all"
                >
                  <div className={`h-2 bg-gradient-to-r ${cls.gradient}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-3xl">{cls.emoji}</span>
                          <h2 className="text-2xl font-black text-gray-800">{cls.label}</h2>
                        </div>
                        <p className="text-xs text-gray-400">
                          {cls.subjects.length} {cls.subjects.length === 1 ? "subject" : "subjects"} · {expCount} experiment{expCount === 1 ? "" : "s"} live
                        </p>
                      </div>
                      <motion.div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cls.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                      >
                        <GraduationCap className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {cls.subjects.map((s) => (
                        <span key={s} className="text-[10px] uppercase tracking-wide font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {expCount > 0 ? `${expCount} experiment${expCount === 1 ? "" : "s"} ready` : "Coming soon"}
                      </span>
                      <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5 group-hover:gap-2 transition-all">
                        Enter <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs text-gray-400">
            Teachers · Use this as a classroom demo or homework aid. Students · Repeat experiments without wearing out the lab kit.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
