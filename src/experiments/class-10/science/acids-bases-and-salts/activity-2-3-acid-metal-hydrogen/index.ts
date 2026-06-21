// NCERT Class 10 · Science · Chapter 2 · Activity 2.3
// Acid + Metal → Salt + H₂↑ (Mg, Zn, Fe in dilute HCl).

import type { ExperimentManifest } from "@/lib/lab-types";
import { AcidMetalHydrogenActivity } from "@/components/lab/activities/AcidMetalHydrogenActivity";

export const manifest: ExperimentManifest = {
  id: "activity-2-3-acid-metal-hydrogen",
  title: "Activity 2.3 — Acid + Metal → Salt + H₂",
  emoji: "🫧",
  blurb: "NCERT Activity 2.3: Drop Mg, Zn, and Fe in dilute HCl. All release H₂ gas (rate: Mg > Zn > Fe). Pop test confirms H₂. Displacement reaction.",
  gradient: "from-emerald-400 to-teal-500",
  durationMin: 8,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, Component: AcidMetalHydrogenActivity };
export default module;
