// NCERT Class 10 · Science · Chapter 1 · Activity 1.10
// Copper Oxide + Hydrogen — Redox reaction.
// Equation: CuO + H₂ → Cu + H₂O (black → red-brown, water droplets).

import type { ExperimentManifest } from "@/lib/lab-types";
import { CopperOxideHydrogenActivity } from "@/components/lab/activities/CopperOxideHydrogenActivity";

export const manifest: ExperimentManifest = {
  id: "activity-1-10-copper-oxide-hydrogen",
  title: "Activity 1.10 — CuO + H₂",
  emoji: "⚫",
  blurb: "NCERT Activity 1.10: CuO + H₂ → Cu + H₂O. Black powder turns red-brown; water droplets form. CuO reduced, H₂ oxidised — redox reaction.",
  gradient: "from-zinc-700 to-rose-600",
  durationMin: 8,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, Component: CopperOxideHydrogenActivity };
export default module;
