// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const lucasTest: TestDef = {
  id: 'lucas',
  name: 'Lucas Test',
  category: 'Alcohols',
  emoji: '🧪',
  gradient: 'from-amber-400 to-orange-500',
  desc: 'Distinguish 1°, 2°, 3° alcohols using Lucas Reagent (ZnCl₂ + conc. HCl). Watch for turbidity!',
  reagents: [
    { id: 'lucas', name: 'Lucas Reagent', shortName: 'ZnCl₂+HCl', accentColor: '#d97706', liquidColor: 'rgba(251,191,36,0.3)', ringColor: 'ring-amber-400', bgColor: 'bg-amber-50' },
    { id: 'water', name: 'Water (for dilution)', shortName: 'H₂O', accentColor: '#3b82f6', liquidColor: 'rgba(96,165,250,0.2)', ringColor: 'ring-blue-400', bgColor: 'bg-blue-50' },
  ],
  unknownTypes: ['1° Alcohol', '2° Alcohol', '3° Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add Lucas Reagent first.' }
    if (type === '3° Alcohol') return { visual: 'turbidity', liquidColor: 'rgba(255,255,255,0.7)', turbiditySpeed: 'immediate', description: 'Immediate turbidity! 3° alcohol reacts instantly forming alkyl chloride.' }
    if (type === '2° Alcohol') return { visual: 'turbidity', liquidColor: 'rgba(255,255,255,0.5)', turbiditySpeed: 'slow', description: 'Turbidity appears within 5 minutes. 2° alcohol reacts slowly.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(200,220,255,0.2)', description: 'No turbidity at room temperature. 1° alcohol does not react.' }
  },
  introSteps: [
    { title: 'Three Unknown Alcohols', desc: 'Tubes A, B, C contain 1°, 2°, and 3° alcohols — identify which is which.' },
    { title: 'Add Lucas Reagent', desc: 'Lucas Reagent (ZnCl₂ + conc. HCl) reacts differently with each alcohol type.' },
    { title: 'Observe Turbidity', desc: 'Immediate cloudiness = 3° alcohol. Slow (5 min) = 2° alcohol. No reaction = 1° alcohol.' },
  ],
  reactionKey: [
    { type: '3° Alcohol', results: ['+ Lucas Reagent → Immediate turbidity'], color: 'bg-red-50', textColor: 'text-red-700' },
    { type: '2° Alcohol', results: ['+ Lucas Reagent → Turbidity in ~5 min'], color: 'bg-amber-50', textColor: 'text-amber-700' },
    { type: '1° Alcohol', results: ['+ Lucas Reagent → No turbidity at RT'], color: 'bg-emerald-50', textColor: 'text-emerald-700' },
  ],
  recap: [
    '3° Alcohols react fastest with Lucas Reagent because the 3° carbocation formed is the most stable.',
    '2° Alcohols react slowly as the 2° carbocation is moderately stable.',
    '1° Alcohols do not react at room temperature because 1° carbocation is too unstable to form.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "lucas-test",
  title: "Lucas Test",
  emoji: "\ud83e\uddea",
  blurb: "Distinguish 1\u00b0/2\u00b0/3\u00b0 alcohols with ZnCl\u2082 + conc. HCl \u2014 turbidity speed tells the grade.",
  gradient: "from-amber-400 to-orange-500",
  durationMin: 6,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "alcohols-phenols-and-ethers",
};

const module = { manifest, test: lucasTest };
export default module;
