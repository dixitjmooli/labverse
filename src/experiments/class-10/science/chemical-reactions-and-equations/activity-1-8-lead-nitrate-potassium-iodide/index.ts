// NCERT Class 10 · Science · Chapter 1 · Activity 1.8
// Lead Nitrate + Potassium Iodide — Double Displacement.
// Equation: Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃ (bright yellow PbI₂ precipitate).

import type { ExperimentManifest } from "@/lib/lab-types";
import { LeadNitratePotassiumIodideActivity } from "@/components/lab/activities/LeadNitratePotassiumIodideActivity";

export const manifest: ExperimentManifest = {
  id: "activity-1-8-lead-nitrate-potassium-iodide",
  title: "Activity 1.8 — Pb(NO₃)₂ + KI",
  emoji: "🟡",
  blurb: "NCERT Activity 1.8: Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃. Bright yellow precipitate of lead iodide forms instantly. Double displacement reaction.",
  gradient: "from-yellow-300 to-amber-500",
  durationMin: 5,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, Component: LeadNitratePotassiumIodideActivity };
export default module;
