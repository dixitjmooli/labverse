// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const cericAmmoniumNitrateTest: TestDef = {
  id: 'ceric',
  name: 'Ceric Ammonium Nitrate Test',
  category: 'Alcohols',
  emoji: '⚡',
  gradient: 'from-yellow-400 to-amber-500',
  desc: 'Ceric Ammonium Nitrate turns from yellow to red in presence of alcohols (1°, 2°, 3°).',
  reagents: [
    { id: 'can', name: 'Ceric Ammonium Nitrate', shortName: '(NH₄)₂Ce(NO₃)₆', accentColor: '#ca8a04', liquidColor: 'rgba(202,138,4,0.3)', ringColor: 'ring-yellow-400', bgColor: 'bg-yellow-50' },
    { id: 'can-dil', name: 'Dilute HNO₃', shortName: 'HNO₃', accentColor: '#a16207', liquidColor: 'rgba(161,98,7,0.15)', ringColor: 'ring-amber-400', bgColor: 'bg-amber-50' },
  ],
  unknownTypes: ['Alcohol', 'Phenol', 'Carboxylic Acid'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add Ceric Ammonium Nitrate first.' }
    if (type === 'Alcohol') return { visual: 'color-change', liquidColor: 'rgba(220,38,38,0.35)', description: 'Yellow → Red! Alcohol forms a red complex with ceric ammonium nitrate.' }
    if (type === 'Phenol') return { visual: 'color-change', liquidColor: 'rgba(34,100,50,0.3)', description: 'Green/brown color. Phenol gives a different colored complex.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(202,138,4,0.2)', description: 'No red color. Carboxylic acids do not form the red complex.' }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain an alcohol, a phenol, and a carboxylic acid.' },
    { title: 'Add CAN Reagent', desc: 'Ceric Ammonium Nitrate is yellow. It reacts with alcohols to give red color.' },
    { title: 'Observe Color', desc: 'Red = Alcohol. Green-brown = Phenol. No change = Carboxylic acid.' },
  ],
  reactionKey: [
    { type: 'Alcohol', results: ['Yellow → Red (alkoxy cerium complex)'], color: 'bg-red-50', textColor: 'text-red-700' },
    { type: 'Phenol', results: ['Green-brown color'], color: 'bg-green-50', textColor: 'text-green-700' },
    { type: 'Carboxylic Acid', results: ['No red color change'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    'Alcohols react with CAN to form a red alkoxy cerium complex: (NH₄)₂Ce(NO₃)₅(OR).',
    'Phenols give a green-brown to brown color, different from the red of alcohols.',
    'Carboxylic acids do not give the characteristic red color.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "ceric-ammonium-nitrate-test",
  title: "Ceric Ammonium Nitrate Test",
  emoji: "\u26a1",
  blurb: "CAN reagent gives red colour with alcohols & phenols \u2014 quick positive test.",
  gradient: "from-yellow-400 to-amber-500",
  durationMin: 4,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "alcohols-phenols-and-ethers",
};

const module = { manifest, test: cericAmmoniumNitrateTest };
export default module;
