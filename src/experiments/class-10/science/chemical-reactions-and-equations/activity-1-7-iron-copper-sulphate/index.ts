// NCERT Class 10 · Science · Chapter 1 · Activity 1.7
// Iron nail + Copper Sulphate — Displacement.
// Equation: Fe + CuSO₄ → FeSO₄ + Cu (blue → green, brown Cu deposit).

import type { ExperimentManifest } from "@/lib/lab-types";
import { IronCopperSulphateActivity } from "@/components/lab/activities/IronCopperSulphateActivity";

export const manifest: ExperimentManifest = {
  id: "activity-1-7-iron-copper-sulphate",
  title: "Activity 1.7 — Iron Nail in CuSO₄",
  emoji: "🔵",
  blurb: "NCERT Activity 1.7: Fe + CuSO₄ → FeSO₄ + Cu. Blue solution fades to green, brown Cu deposit on the iron nail. Displacement reaction.",
  gradient: "from-blue-500 to-emerald-500",
  durationMin: 7,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, Component: IronCopperSulphateActivity };
export default module;
