// NCERT Class 10 · Science · Chapter 2 · Activity 2.2
// Bases taste bitter, feel soapy, and turn RED litmus paper BLUE.

import type { ExperimentManifest } from "@/lib/lab-types";
import { BasesBitterRedLitmusActivity } from "@/components/lab/activities/BasesBitterRedLitmusActivity";

export const manifest: ExperimentManifest = {
  id: "activity-2-2-bases-bitter-red-litmus",
  title: "Activity 2.2 — Bases & Red Litmus",
  emoji: "🟥",
  blurb: "NCERT Activity 2.2: Test NaOH, KOH, and Ca(OH)₂ (limewater) with red litmus paper. All three turn BLUE — they are all bases.",
  gradient: "from-blue-400 to-cyan-500",
  durationMin: 6,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, Component: BasesBitterRedLitmusActivity };
export default module;
