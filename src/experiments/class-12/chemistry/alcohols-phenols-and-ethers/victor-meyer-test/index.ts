// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const victorMeyerTest: TestDef = {
  id: 'victor-meyer',
  name: 'Victor Meyer Test',
  category: 'Alcohols',
  emoji: '🎨',
  gradient: 'from-red-400 to-pink-500',
  desc: 'Classical test: Different colored solutions for 1° (red), 2° (blue), 3° (colorless) alcohols.',
  reagents: [
    { id: 'vm-r1', name: 'PI₃ / Red P + I₂', shortName: 'PI₃', accentColor: '#be185d', liquidColor: 'rgba(190,24,93,0.2)', ringColor: 'ring-pink-400', bgColor: 'bg-pink-50' },
    { id: 'vm-r2', name: 'AgNO₂ / NaNO₂', shortName: 'AgNO₂', accentColor: '#7c3aed', liquidColor: 'rgba(124,58,237,0.2)', ringColor: 'ring-violet-400', bgColor: 'bg-violet-50' },
  ],
  unknownTypes: ['1° Alcohol', '2° Alcohol', '3° Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (r1 && !r2) return { visual: 'color-change', liquidColor: 'rgba(200,210,240,0.2)', description: 'Step 1 done: alkyl iodide formed. Now add AgNO₂.' }
    if (!r1 && r2) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add PI₃ first, then AgNO₂.' }
    if (type === '1° Alcohol') return { visual: 'color-change', liquidColor: 'rgba(239,68,68,0.4)', description: 'Red color! Nitroalkane formed from 1° alcohol gives red color with nitrous acid.' }
    if (type === '2° Alcohol') return { visual: 'color-change', liquidColor: 'rgba(59,130,246,0.4)', description: 'Blue color! Pseudonitrol formed from 2° alcohol gives blue color.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'No color. 3° alcohol does not give this test — nitroalkane is not formed.' }
  },
  introSteps: [
    { title: 'Three Unknown Alcohols', desc: 'Tubes A, B, C contain 1°, 2°, and 3° alcohols.' },
    { title: 'Add PI₃ then AgNO₂', desc: 'First converts alcohol to alkyl iodide, then to nitroalkane.' },
    { title: 'Observe Color', desc: 'Red = 1° alcohol. Blue = 2° alcohol. Colorless = 3° alcohol.' },
  ],
  reactionKey: [
    { type: '1° Alcohol', results: ['Red color (nitroalkane → nitrous acid → red)'], color: 'bg-red-50', textColor: 'text-red-700' },
    { type: '2° Alcohol', results: ['Blue color (pseudonitrol formed)'], color: 'bg-blue-50', textColor: 'text-blue-700' },
    { type: '3° Alcohol', results: ['No color (does not give test)'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    '1° Alcohol → R-I → R-NO₂ (1° nitroalkane) → with HNO₂ gives red color.',
    '2° Alcohol → R-I → R-NO₂ (2° nitroalkane) → with HNO₂ gives blue pseudonitrol.',
    '3° Alcohol does not form nitroalkane under these conditions, so no color is observed.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "victor-meyer-test",
  title: "Victor Meyer Test",
  emoji: "\ud83c\udfa8",
  blurb: "Classic colour test: 1\u00b0 red, 2\u00b0 blue, 3\u00b0 colourless \u2014 distinguishes alcohol classes.",
  gradient: "from-red-400 to-pink-500",
  durationMin: 7,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "alcohols-phenols-and-ethers",
};

const module = { manifest, test: victorMeyerTest };
export default module;
