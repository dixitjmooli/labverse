// NCERT Class 10 · Science · Chapter 2 · Activity 2.8
// pH test of various solutions using Universal Indicator.

import type { ExperimentManifest } from "@/lib/lab-types";
import { PhTestActivity } from "@/components/lab/activities/PhTestActivity";

export const manifest: ExperimentManifest = {
  id: "activity-2-8-ph-test",
  title: "Activity 2.8 — pH Test with Universal Indicator",
  emoji: "🌈",
  blurb: "NCERT Activity 2.8: Add Universal Indicator to 6 mystery solutions (HCl, lemon, water, baking soda, milk of magnesia, NaOH). Match each colour to the pH scale 1-14.",
  gradient: "from-rose-400 via-amber-400 to-violet-500",
  durationMin: 9,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, Component: PhTestActivity };
export default module;
