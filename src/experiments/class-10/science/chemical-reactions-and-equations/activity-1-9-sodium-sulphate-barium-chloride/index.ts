// NCERT Class 10 · Science · Chapter 1 · Activity 1.9
// Sodium Sulphate + Barium Chloride — Double Displacement.
// Equation: Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl (heavy white BaSO₄ precipitate).

import type { ExperimentManifest } from "@/lib/lab-types";
import { SodiumSulphateBariumChlorideActivity } from "@/components/lab/activities/SodiumSulphateBariumChlorideActivity";

export const manifest: ExperimentManifest = {
  id: "activity-1-9-sodium-sulphate-barium-chloride",
  title: "Activity 1.9 — Na₂SO₄ + BaCl₂",
  emoji: "⚪",
  blurb: "NCERT Activity 1.9: Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl. Heavy white precipitate of barium sulphate forms instantly. Double displacement reaction.",
  gradient: "from-slate-300 to-blue-400",
  durationMin: 5,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, Component: SodiumSulphateBariumChlorideActivity };
export default module;
