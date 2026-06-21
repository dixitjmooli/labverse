// NCERT Class 10 · Science · Chapter 1 · Activity 1.2
// Zinc granules + dilute HCl — Displacement reaction.
// Equation: Zn + 2HCl → ZnCl₂ + H₂↑ (brisk effervescence, 'pop' test, exothermic).
//
// This activity uses a bespoke scene-based simulation (conical flask +
// zinc granules + HCl bottle + bubbles + matchstick pop test).

import type { ExperimentManifest } from "@/lib/lab-types";
import { ZincHclActivity } from "@/components/lab/activities/ZincHclActivity";

export const manifest: ExperimentManifest = {
  id: "activity-1-2-zinc-hcl",
  title: "Activity 1.2 — Zinc + dilute HCl",
  emoji: "🫧",
  blurb: "NCERT Activity 1.2: Zn granules + dilute HCl → ZnCl₂ + H₂↑. Brisk effervescence, 'pop' sound test, exothermic displacement reaction.",
  gradient: "from-sky-400 to-blue-500",
  durationMin: 7,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, Component: ZincHclActivity };
export default module;
