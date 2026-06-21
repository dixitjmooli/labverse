// NCERT Class 10 · Science · Chapter 1 · Activity 1.5
// Heating Lead Nitrate — Thermal Decomposition.
// Equation: 2Pb(NO₃)₂ → 2PbO + 4NO₂↑ + O₂↑ (brown NO₂ fumes, yellow PbO, O₂ rekindles splint).

import type { ExperimentManifest } from "@/lib/lab-types";
import { HeatingLeadNitrateActivity } from "@/components/lab/activities/HeatingLeadNitrateActivity";

export const manifest: ExperimentManifest = {
  id: "activity-1-5-heating-lead-nitrate",
  title: "Activity 1.5 — Heating Lead Nitrate",
  emoji: "🟤",
  blurb: "NCERT Activity 1.5: 2Pb(NO₃)₂ → 2PbO + 4NO₂ + O₂. White crystals → brown NO₂ fumes + yellow PbO residue. Thermal decomposition.",
  gradient: "from-amber-400 to-yellow-600",
  durationMin: 7,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, Component: HeatingLeadNitrateActivity };
export default module;
