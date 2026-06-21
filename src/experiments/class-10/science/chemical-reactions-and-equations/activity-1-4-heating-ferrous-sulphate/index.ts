// NCERT Class 10 · Science · Chapter 1 · Activity 1.4
// Heating of Ferrous Sulphate crystals — Thermal Decomposition.
// Equation: 2FeSO₄ → Fe₂O₃ + SO₂↑ + SO₃↑ (green → white → red-brown, burning sulphur smell).

import type { ExperimentManifest } from "@/lib/lab-types";
import { HeatingFerrousSulphateActivity } from "@/components/lab/activities/HeatingFerrousSulphateActivity";

export const manifest: ExperimentManifest = {
  id: "activity-1-4-heating-ferrous-sulphate",
  title: "Activity 1.4 — Heating Ferrous Sulphate",
  emoji: "🌡️",
  blurb: "NCERT Activity 1.4: 2FeSO₄ → Fe₂O₃ + SO₂ + SO₃. Green crystals turn reddish-brown; smell of burning sulphur. Thermal decomposition.",
  gradient: "from-emerald-400 to-rose-500",
  durationMin: 7,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, Component: HeatingFerrousSulphateActivity };
export default module;
