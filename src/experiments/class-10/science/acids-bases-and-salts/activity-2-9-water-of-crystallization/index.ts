// NCERT Class 10 · Science · Chapter 2 · Activity 2.9
// Water of Crystallization — CuSO₄·5H₂O (blue) ⇌ CuSO₄ (white) + 5H₂O.

import type { ExperimentManifest } from "@/lib/lab-types";
import { WaterOfCrystallizationActivity } from "@/components/lab/activities/WaterOfCrystallizationActivity";

export const manifest: ExperimentManifest = {
  id: "activity-2-9-water-of-crystallization",
  title: "Activity 2.9 — Water of Crystallization",
  emoji: "💧",
  blurb: "NCERT Activity 2.9: Heat CuSO₄·5H₂O (blue) → CuSO₄ (white) + 5H₂O. Add water back → blue again. Reversible reaction. Concept: water of crystallization.",
  gradient: "from-blue-400 to-indigo-500",
  durationMin: 8,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, Component: WaterOfCrystallizationActivity };
export default module;
