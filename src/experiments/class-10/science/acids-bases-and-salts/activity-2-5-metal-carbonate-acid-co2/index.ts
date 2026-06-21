// NCERT Class 10 · Science · Chapter 2 · Activity 2.5
// Metal carbonate + Acid → Salt + H₂O + CO₂↑ (CaCO₃ + HCl, lime water test).

import type { ExperimentManifest } from "@/lib/lab-types";
import { MetalCarbonateAcidCO2Activity } from "@/components/lab/activities/MetalCarbonateAcidCO2Activity";

export const manifest: ExperimentManifest = {
  id: "activity-2-5-metal-carbonate-acid-co2",
  title: "Activity 2.5 — Metal Carbonate + Acid → CO₂",
  emoji: "🫧",
  blurb: "NCERT Activity 2.5: CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑. CO₂ turns lime water milky. Same reaction as baking soda + vinegar.",
  gradient: "from-amber-400 to-lime-500",
  durationMin: 7,
  classId: "10",
  subjectId: "science",
  chapterSlug: "acids-bases-and-salts",
};

const module = { manifest, Component: MetalCarbonateAcidCO2Activity };
export default module;
