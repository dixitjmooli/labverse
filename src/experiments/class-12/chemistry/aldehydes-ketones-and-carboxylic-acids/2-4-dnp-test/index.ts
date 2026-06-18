// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const dnpTest: TestDef = {
  id: 'dnp',
  name: '2,4-DNP Test',
  category: 'Aldehydes & Ketones',
  emoji: '🌼',
  gradient: 'from-yellow-400 to-amber-500',
  desc: '2,4-Dinitrophenylhydrazine gives yellow/orange precipitate with carbonyl compounds (aldehydes & ketones).',
  reagents: [
    { id: 'dnp', name: '2,4-DNP Reagent', shortName: '2,4-DNPH', accentColor: '#ca8a04', liquidColor: 'rgba(202,138,4,0.25)', ringColor: 'ring-yellow-400', bgColor: 'bg-yellow-50' },
    { id: 'dnp-acid', name: 'Dil. H₂SO₄', shortName: 'H₂SO₄', accentColor: '#a16207', liquidColor: 'rgba(161,98,7,0.1)', ringColor: 'ring-amber-400', bgColor: 'bg-amber-50' },
  ],
  unknownTypes: ['Aldehyde', 'Ketone', 'Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add 2,4-DNP reagent first.' }
    if (type === 'Aldehyde') return { visual: 'precipitate', precipitateColor: '#eab308', liquidColor: 'rgba(234,179,8,0.3)', description: 'Yellow precipitate! 2,4-DNP hydrazone formed with aldehyde.' }
    if (type === 'Ketone') return { visual: 'precipitate', precipitateColor: '#f97316', liquidColor: 'rgba(249,115,22,0.3)', description: 'Orange precipitate! 2,4-DNP hydrazone formed with ketone.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(202,138,4,0.1)', description: 'No precipitate. Alcohols do not have a carbonyl group.' }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain aldehyde, ketone, and alcohol.' },
    { title: 'Add 2,4-DNP Reagent', desc: '2,4-DNPH reacts with C=O group to form hydrazones (yellow/orange ppt).' },
    { title: 'Observe Precipitate', desc: 'Yellow ppt = Aldehyde. Orange ppt = Ketone. No ppt = Alcohol.' },
  ],
  reactionKey: [
    { type: 'Aldehyde', results: ['Yellow precipitate (2,4-DNP hydrazone)'], color: 'bg-yellow-50', textColor: 'text-yellow-700' },
    { type: 'Ketone', results: ['Orange precipitate (2,4-DNP hydrazone)'], color: 'bg-orange-50', textColor: 'text-orange-700' },
    { type: 'Alcohol', results: ['No precipitate (no C=O group)'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    '2,4-DNPH reacts with the carbonyl group (C=O) of aldehydes and ketones to form 2,4-dinitrophenylhydrazones.',
    'Aldehydes typically give yellow precipitates, while ketones give orange precipitates.',
    'Alcohols do not have a C=O group and give no precipitate. This test confirms the presence of a carbonyl group.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "2-4-dnp-test",
  title: "2,4-DNP Test",
  emoji: "\ud83c\udf3c",
  blurb: "2,4-DNP (Brady's reagent) gives yellow/orange ppt with aldehydes AND ketones.",
  gradient: "from-yellow-400 to-amber-500",
  durationMin: 5,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "aldehydes-ketones-and-carboxylic-acids",
};

const module = { manifest, test: dnpTest };
export default module;
