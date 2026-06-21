// NCERT Class 10 · Science · Chapter 2 · Activity 2.7
// Non-metal oxide + Base → Salt + Water (CO₂ + NaOH → Na₂CO₃ + H₂O, with phenolphthalein).

import type { ExperimentManifest } from "@/lib/lab-types";
import { NonMetalOxideBaseActivity } from "@/components/lab/activities/NonMetalOxideBaseActivity";

export const manifest: ExperimentManifest = {
  id: "activity-2-7-non-metal-oxide-base",
  title: "Activity 2.7 — Non-metal Oxide + Base",
  emoji: "💨",
  blurb: "NCERT Activity 2.7: 2NaOH + CO₂ → Na₂CO₃ + H₂O. CO₂ is an acidic oxide — it neutralises NaOH. Phenolphthalein pink → colourless. Mirror of Activity 2.6.",
  gradient: "from-rose-400 to-pink-500",
  durationMin: 7,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, Component: NonMetalOxideBaseActivity };
export default module;
