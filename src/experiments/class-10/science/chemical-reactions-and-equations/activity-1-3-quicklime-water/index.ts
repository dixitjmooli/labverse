// NCERT Class 10 · Science · Chapter 1 · Activity 1.3
// Quicklime + Water — Combination (exothermic) reaction.
// Equation: CaO + H₂O → Ca(OH)₂ (hissing, steam, hot, red litmus → blue).

import type { ExperimentManifest } from "@/lib/lab-types";
import { QuicklimeWaterActivity } from "@/components/lab/activities/QuicklimeWaterActivity";

export const manifest: ExperimentManifest = {
  id: "activity-1-3-quicklime-water",
  title: "Activity 1.3 — Quicklime + Water",
  emoji: "🪨",
  blurb: "NCERT Activity 1.3: CaO + H₂O → Ca(OH)₂. Vigorous exothermic combination reaction. Slaked lime suspension turns red litmus blue.",
  gradient: "from-slate-400 to-zinc-500",
  durationMin: 6,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, Component: QuicklimeWaterActivity };
export default module;
