// NCERT Class 10 · Science · Chapter 1 · Activity 1.1
// Burning of a Magnesium Ribbon in air — a Combination reaction.
//
// Equation: 2Mg + O₂ → 2MgO
// Observation: dazzling white flame, white ash (MgO) left behind.
// NCERT note: also an oxidation reaction (Mg gains oxygen).
//
// This activity uses a bespoke scene-based simulation
// (sandpaper → tongs → burner → flame → ash) rather than the generic
// test-tube player. See BurningMagnesiumActivity.tsx for the full UI.

import type { ExperimentManifest } from "@/lib/lab-types";
import { BurningMagnesiumActivity } from "@/components/lab/activities/BurningMagnesiumActivity";

export const manifest: ExperimentManifest = {
  id: "activity-1-1-burning-magnesium",
  title: "Activity 1.1 — Burning Magnesium Ribbon",
  emoji: "🔥",
  blurb: "NCERT Activity 1.1: Clean a magnesium ribbon with sandpaper, hold it with tongs, ignite over a burner. Watch the dazzling white flame and the white MgO ash. Combination + oxidation reaction.",
  gradient: "from-amber-400 to-orange-500",
  durationMin: 6,
  classId: "10",
  subjectId: "science",
  chapterSlug: "chemical-reactions-and-equations",
};

const module = { manifest, Component: BurningMagnesiumActivity };
export default module;
