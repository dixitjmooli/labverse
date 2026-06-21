// NCERT Class 10 · Science · Chapter 1 · Activity 1.6
// Silver Chloride in sunlight — Photolytic Decomposition.
// Equation: 2AgCl → 2Ag + Cl₂↑ (white → grey in sunlight).

import type { ExperimentManifest } from "@/lib/lab-types";
import { SilverChlorideSunlightActivity } from "@/components/lab/activities/SilverChlorideSunlightActivity";

export const manifest: ExperimentManifest = {
  id: "activity-1-6-silver-chloride-sunlight",
  title: "Activity 1.6 — Silver Chloride in Sunlight",
  emoji: "☀️",
  blurb: "NCERT Activity 1.6: 2AgCl → 2Ag + Cl₂. White powder turns grey in sunlight. Photolytic decomposition — basis of black-and-white photography.",
  gradient: "from-yellow-300 to-amber-500",
  durationMin: 8,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, Component: SilverChlorideSunlightActivity };
export default module;
