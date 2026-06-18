// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const esterTest: TestDef = {
  id: 'ester',
  name: 'Esterification Test',
  category: 'Carboxylic Acids',
  emoji: '🌸',
  gradient: 'from-pink-400 to-rose-500',
  desc: 'Carboxylic acid + Alcohol + H₂SO₄ (catalyst) → Ester with sweet fruity smell!',
  reagents: [
    { id: 'ethanol', name: 'Ethanol', shortName: 'C₂H₅OH', accentColor: '#be185d', liquidColor: 'rgba(190,24,93,0.15)', ringColor: 'ring-pink-400', bgColor: 'bg-pink-50' },
    { id: 'h2so4', name: 'Conc. H₂SO₄ (catalyst)', shortName: 'H₂SO₄', accentColor: '#dc2626', liquidColor: 'rgba(220,38,38,0.1)', ringColor: 'ring-red-400', bgColor: 'bg-red-50' },
  ],
  unknownTypes: ['Carboxylic Acid', 'Phenol', 'Aldehyde'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add ethanol first.' }
    if (r1 && !r2) return { visual: 'no-reaction', liquidColor: 'rgba(190,24,93,0.1)', description: 'Ethanol added. Now add H₂SO₄ catalyst and heat.' }
    if (type === 'Carboxylic Acid') return { visual: 'fruity-smell', liquidColor: 'rgba(244,114,182,0.25)', description: 'Sweet fruity smell! Ester formed from carboxylic acid + ethanol.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: `No fruity smell. ${type} does not undergo esterification with ethanol.` }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain carboxylic acid, phenol, and aldehyde.' },
    { title: 'Add Ethanol + H₂SO₄', desc: 'Conc. H₂SO₄ catalyzes ester formation: RCOOH + C₂H₅OH → RCOOC₂H₅ + H₂O.' },
    { title: 'Smell the Product', desc: 'Sweet fruity smell = Ester formed = Carboxylic acid. No smell = Phenol/Aldehyde.' },
  ],
  reactionKey: [
    { type: 'Carboxylic Acid', results: ['Sweet fruity smell (ester formed)'], color: 'bg-pink-50', textColor: 'text-pink-700' },
    { type: 'Phenol', results: ['No fruity smell (phenol ester less distinct)'], color: 'bg-gray-50', textColor: 'text-gray-700' },
    { type: 'Aldehyde', results: ['No ester formation'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    'Carboxylic acids react with alcohols in the presence of conc. H₂SO₄ to form esters with characteristic fruity smells.',
    'This is Fischer esterification: RCOOH + R\'OH ⇌ RCOOR\' + H₂O (H₂SO₄ catalyst, heat).',
    'Phenols can form esters but the product smell is different. Aldehydes do not undergo esterification.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "ester-test",
  title: "Esterification Test",
  emoji: "\ud83c\udf38",
  blurb: "Carboxylic acid + alcohol + H\u2082SO\u2084 \u2192 sweet fruity ester smell.",
  gradient: "from-pink-400 to-rose-500",
  durationMin: 5,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "aldehydes-ketones-and-carboxylic-acids",
};

const module = { manifest, test: esterTest };
export default module;
