// NCERT Class 10 · Science · Chapter 2 · Activity 2.1
// Acids are sour; they turn BLUE litmus paper RED.
// Tested on dilute HCl, dilute H₂SO₄, and vinegar (CH₃COOH).

import type { ExperimentManifest } from "@/lib/lab-types";
import { AcidsSourBlueLitmusActivity } from "@/components/lab/activities/AcidsSourBlueLitmusActivity";

export const manifest: ExperimentManifest = {
  id: "activity-2-1-acids-sour-blue-litmus",
  title: "Activity 2.1 — Acids & Blue Litmus",
  emoji: "🟦",
  blurb: "NCERT Activity 2.1: Test dilute HCl, dilute H₂SO₄, and vinegar (CH₃COOH) with blue litmus paper. All three turn RED — they are all acids.",
  gradient: "from-red-400 to-orange-500",
  durationMin: 6,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, Component: AcidsSourBlueLitmusActivity };
export default module;
