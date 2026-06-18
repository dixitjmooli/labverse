// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const nahco3Test: TestDef = {
  id: 'nahco3',
  name: 'Sodium Bicarbonate Test',
  category: 'Carboxylic Acids',
  emoji: '🫧',
  gradient: 'from-cyan-400 to-blue-500',
  desc: 'NaHCO₃ produces brisk effervescence (CO₂) with carboxylic acids. Phenols and alcohols do not react.',
  reagents: [
    { id: 'nahco3', name: 'NaHCO₃ Solution', shortName: 'NaHCO₃', accentColor: '#0891b2', liquidColor: 'rgba(8,145,178,0.2)', ringColor: 'ring-cyan-400', bgColor: 'bg-cyan-50' },
    { id: 'lime', name: 'Ca(OH)₂ (lime water)', shortName: 'Ca(OH)₂', accentColor: '#e5e7eb', liquidColor: 'rgba(229,231,235,0.3)', ringColor: 'ring-gray-300', bgColor: 'bg-gray-50' },
  ],
  unknownTypes: ['Carboxylic Acid', 'Phenol', 'Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add NaHCO₃ solution first.' }
    if (r1 && !r2) {
      if (type === 'Carboxylic Acid') return { visual: 'effervescence', liquidColor: 'rgba(8,145,178,0.15)', description: 'Brisk effervescence! CO₂ gas evolved from carboxylic acid + NaHCO₃.' }
      return { visual: 'no-reaction', liquidColor: 'rgba(8,145,178,0.1)', description: `No effervescence. ${type} is weaker than H₂CO₃ and does not react.` }
    }
    // Both added - test CO2 with lime water
    if (type === 'Carboxylic Acid') return { visual: 'effervescence', liquidColor: 'rgba(255,255,255,0.4)', description: 'CO₂ turns lime water milky! Confirmed carboxylic acid.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(8,145,178,0.1)', description: `No CO₂ evolved. ${type} confirmed.` }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain carboxylic acid, phenol, and alcohol.' },
    { title: 'Add NaHCO₃', desc: 'Carboxylic acids are stronger than H₂CO₃ and release CO₂ with NaHCO₃.' },
    { title: 'Observe Effervescence', desc: 'Brisk effervescence (CO₂) = Carboxylic acid. No bubbles = Phenol or Alcohol.' },
  ],
  reactionKey: [
    { type: 'Carboxylic Acid', results: ['Brisk effervescence (CO₂)', 'CO₂ turns lime water milky'], color: 'bg-cyan-50', textColor: 'text-cyan-700' },
    { type: 'Phenol', results: ['No effervescence (weaker than H₂CO₃)'], color: 'bg-gray-50', textColor: 'text-gray-700' },
    { type: 'Alcohol', results: ['No effervescence (neutral)'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    'Carboxylic acids are stronger acids than H₂CO₃ (carbonic acid), so they displace CO₂ from NaHCO₃.',
    'Phenols are weaker acids than H₂CO₃ and do not react with NaHCO₃ — this is a key distinction.',
    'Alcohols are essentially neutral and do not react with NaHCO₃.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "nahco3-test",
  title: "Sodium Bicarbonate Test",
  emoji: "\ud83e\udee7",
  blurb: "NaHCO\u2083 brisk effervescence (CO\u2082) \u2014 only with carboxylic acids, not phenols.",
  gradient: "from-cyan-400 to-blue-500",
  durationMin: 4,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "aldehydes-ketones-and-carboxylic-acids",
};

const module = { manifest, test: nahco3Test };
export default module;
