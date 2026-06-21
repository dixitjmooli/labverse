// NCERT Class 10 · Science · Chapter 2 · Activity 2.10
// Plaster of Paris — gypsum ⇌ PoP + 1½ H₂O.

import type { ExperimentManifest } from "@/lib/lab-types";
import { PlasterOfParisActivity } from "@/components/lab/activities/PlasterOfParisActivity";

export const manifest: ExperimentManifest = {
  id: "activity-2-10-plaster-of-paris",
  title: "Activity 2.10 — Plaster of Paris",
  emoji: "🪨",
  blurb: "NCERT Activity 2.10: Heat gypsum (CaSO₄·2H₂O) at 373 K → Plaster of Paris (CaSO₄·½H₂O). Add water → sets back to hard gypsum. Used in casts & moulds.",
  gradient: "from-amber-400 to-stone-500",
  durationMin: 9,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, Component: PlasterOfParisActivity };
export default module;
