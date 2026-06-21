// NCERT Class 10 · Science · Chapter 2 · Activity 2.4
// Base + Amphoteric Metal → Salt + H₂ (NaOH + Zn → Na₂ZnO₂ + H₂).

import type { ExperimentManifest } from "@/lib/lab-types";
import { BaseMetalHydrogenActivity } from "@/components/lab/activities/BaseMetalHydrogenActivity";

export const manifest: ExperimentManifest = {
  id: "activity-2-4-base-metal-hydrogen",
  title: "Activity 2.4 — Base + Metal → Salt + H₂",
  emoji: "🧪",
  blurb: "NCERT Activity 2.4: 2NaOH + Zn → Na₂ZnO₂ + H₂. Zinc (amphoteric) reacts with NaOH on warming. Pop test confirms H₂. Most metals do NOT react with bases.",
  gradient: "from-violet-400 to-fuchsia-500",
  durationMin: 8,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, Component: BaseMetalHydrogenActivity };
export default module;
