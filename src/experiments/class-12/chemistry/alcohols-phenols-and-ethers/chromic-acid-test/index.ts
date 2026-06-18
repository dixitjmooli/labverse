// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const chromicAcidTest: TestDef = {
  id: 'chromic-acid',
  name: 'Chromic Acid Test',
  category: 'Alcohols',
  emoji: '🔬',
  gradient: 'from-orange-400 to-red-500',
  desc: 'Jones oxidation test: K₂Cr₂O₇/H₂SO₄ distinguishes oxidizable alcohols from 3° alcohols.',
  reagents: [
    { id: 'chromic', name: 'Chromic Acid Reagent', shortName: 'K₂Cr₂O₇', accentColor: '#ea580c', liquidColor: 'rgba(234,88,12,0.3)', ringColor: 'ring-orange-400', bgColor: 'bg-orange-50' },
    { id: 'acid', name: 'Dil. H₂SO₄', shortName: 'H₂SO₄', accentColor: '#dc2626', liquidColor: 'rgba(220,38,38,0.15)', ringColor: 'ring-red-400', bgColor: 'bg-red-50' },
  ],
  unknownTypes: ['1° Alcohol', '2° Alcohol', '3° Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add Chromic Acid Reagent first.' }
    if (type === '3° Alcohol') return { visual: 'no-reaction', liquidColor: 'rgba(234,88,12,0.25)', description: 'No color change. 3° alcohols cannot be oxidized.' }
    return { visual: 'color-change', liquidColor: 'rgba(34,197,94,0.4)', description: `Orange → Green! ${type} is oxidized. Cr⁶⁺ (orange) reduces to Cr³⁺ (green).` }
  },
  introSteps: [
    { title: 'Three Unknown Alcohols', desc: 'Tubes A, B, C contain 1°, 2°, and 3° alcohols.' },
    { title: 'Add Chromic Acid', desc: 'K₂Cr₂O₇/H₂SO₄ is orange. If the alcohol can be oxidized, it turns green.' },
    { title: 'Observe Color Change', desc: 'Orange → Green = oxidizable (1° or 2°). No change = 3° alcohol.' },
  ],
  reactionKey: [
    { type: '1° Alcohol', results: ['Orange → Green (oxidized to aldehyde/carboxylic acid)'], color: 'bg-emerald-50', textColor: 'text-emerald-700' },
    { type: '2° Alcohol', results: ['Orange → Green (oxidized to ketone)'], color: 'bg-amber-50', textColor: 'text-amber-700' },
    { type: '3° Alcohol', results: ['No color change (cannot be oxidized)'], color: 'bg-red-50', textColor: 'text-red-700' },
  ],
  recap: [
    '1° Alcohols are oxidized first to aldehydes, then to carboxylic acids. The Cr⁶⁺ is reduced to Cr³⁺, changing color from orange to green.',
    '2° Alcohols are oxidized to ketones. Same color change occurs.',
    '3° Alcohols have no H on the carbon bearing the OH group, so they cannot be oxidized. No color change.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "chromic-acid-test",
  title: "Chromic Acid Test",
  emoji: "\ud83d\udd2c",
  blurb: "Jones reagent (CrO\u2083/H\u2082SO\u2084) oxidizes 1\u00b0 & 2\u00b0 alcohols \u2014 green Cr\u00b3\u207a appears.",
  gradient: "from-orange-400 to-red-500",
  durationMin: 5,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "alcohols-phenols-and-ethers",
};

const module = { manifest, test: chromicAcidTest };
export default module;
