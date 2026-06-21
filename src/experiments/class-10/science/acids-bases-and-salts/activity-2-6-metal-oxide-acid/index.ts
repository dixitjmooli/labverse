// NCERT Class 10 · Science · Chapter 2 · Activity 2.6
// Metal oxide + Acid → Salt + Water (CuO + HCl → CuCl₂ + H₂O).

import type { ExperimentManifest } from "@/lib/lab-types";
import { MetalOxideAcidActivity } from "@/components/lab/activities/MetalOxideAcidActivity";

export const manifest: ExperimentManifest = {
  id: "activity-2-6-metal-oxide-acid",
  title: "Activity 2.6 — Metal Oxide + Acid",
  emoji: "⚫",
  blurb: "NCERT Activity 2.6: CuO + 2HCl → CuCl₂ + H₂O. Black CuO dissolves in HCl, solution turns blue-green. Basic oxide + acid = neutralisation.",
  gradient: "from-slate-500 to-cyan-600",
  durationMin: 6,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, Component: MetalOxideAcidActivity };
export default module;
