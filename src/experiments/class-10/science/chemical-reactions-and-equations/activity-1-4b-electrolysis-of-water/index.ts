// NCERT Class 10 · Science · Chapter 1 · Activity 1.4b (Electrolytic Decomposition)
// Electrolysis of acidulated water — 2H₂O → 2H₂↑ + O₂↑ (electrical energy).
//
// Inserted between Activity 1.4 (thermal decomposition of FeSO₄) and
// Activity 1.5 (thermal decomposition of Pb(NO₃)₂) to complete NCERT's
// coverage of all three decomposition types: thermal / electrolytic / photolytic.

import type { ExperimentManifest } from "@/lib/lab-types";
import { WaterElectrolysisActivity } from "@/components/lab/activities/WaterElectrolysisActivity";

export const manifest: ExperimentManifest = {
  id: "activity-1-4b-electrolysis-of-water",
  title: "Activity 1.4b — Electrolysis of Water",
  emoji: "⚡",
  blurb: "NCERT Electrolytic Decomposition: 2H₂O → 2H₂↑ + O₂↑. Acidulated water splits into H₂ (cathode) and O₂ (anode) in a 2:1 volume ratio. Pop test + glowing splint confirm.",
  gradient: "from-blue-400 via-cyan-400 to-emerald-500",
  durationMin: 9,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, Component: WaterElectrolysisActivity };
export default module;
