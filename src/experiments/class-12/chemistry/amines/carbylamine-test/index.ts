// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const carbylamineTest: TestDef = {
  id: 'carbylamine',
  name: 'Carbylamine Test',
  category: 'Amines',
  emoji: '💨',
  gradient: 'from-lime-400 to-green-500',
  desc: 'CHCl₃ + alc. KOH gives extremely foul smell (isocyanide) with 1° amines only!',
  reagents: [
    { id: 'chcl3', name: 'Chloroform', shortName: 'CHCl₃', accentColor: '#7c3aed', liquidColor: 'rgba(124,58,237,0.25)', ringColor: 'ring-violet-400', bgColor: 'bg-violet-50' },
    { id: 'koh', name: 'Alcoholic KOH', shortName: 'alc. KOH', accentColor: '#059669', liquidColor: 'rgba(5,150,105,0.25)', ringColor: 'ring-emerald-400', bgColor: 'bg-emerald-50' },
  ],
  unknownTypes: ['1° Amine', '2° Amine', '3° Amine'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (r1 && !r2) return { visual: 'no-reaction', liquidColor: 'rgba(124,58,237,0.15)', description: 'CHCl₃ added. Now add alc. KOH and heat.' }
    if (!r1 && r2) return { visual: 'no-reaction', liquidColor: 'rgba(5,150,105,0.15)', description: 'Add CHCl₃ first for the carbylamine test.' }
    if (type === '1° Amine') return { visual: 'foul-smell', liquidColor: 'rgba(132,204,22,0.3)', smellType: 'foul', description: 'FOUL SMELL! Isocyanide (carbylamine) formed — extremely offensive odor!' }
    return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.2)', description: `No reaction. ${type} does NOT give the carbylamine test.` }
  },
  introSteps: [
    { title: 'Three Unknown Amines', desc: 'Tubes A, B, C contain 1°, 2°, and 3° amines.' },
    { title: 'Add CHCl₃ + Alc. KOH', desc: 'Heat the mixture. Only 1° amines form isocyanides.' },
    { title: 'Smell the Result', desc: 'Extremely foul smell = 1° amine. No smell = 2° or 3° amine.' },
  ],
  reactionKey: [
    { type: '1° Amine', results: ['Extremely foul smell (isocyanide)'], color: 'bg-lime-50', textColor: 'text-lime-700' },
    { type: '2° Amine', results: ['No foul smell'], color: 'bg-gray-50', textColor: 'text-gray-700' },
    { type: '3° Amine', results: ['No foul smell'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    '1° Amines react with CHCl₃ and alcoholic KOH to form isocyanides (R-NC), which have an extremely offensive odor.',
    '2° and 3° amines do not give this test — no isocyanide is formed.',
    'This test is specific for primary amines (both aliphatic and aromatic).',
  ],
};

export const manifest: ExperimentManifest = {
  id: "carbylamine-test",
  title: "Carbylamine Test",
  emoji: "\ud83d\udca8",
  blurb: "CHCl\u2083 + alc. KOH \u2192 offensive isocyanide smell with 1\u00b0 amines only.",
  gradient: "from-lime-400 to-green-500",
  durationMin: 5,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "amines",
};

const module = { manifest, test: carbylamineTest };
export default module;
