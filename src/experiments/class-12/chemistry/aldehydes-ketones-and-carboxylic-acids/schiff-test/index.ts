// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const schiffTest: TestDef = {
  id: 'schiff',
  name: "Schiff's Test",
  category: 'Aldehydes & Ketones',
  emoji: '💗',
  gradient: 'from-pink-400 to-rose-500',
  desc: "Schiff's reagent (colorless) restores pink/magenta color with aldehydes. Very sensitive test.",
  reagents: [
    { id: 'schiff', name: "Schiff's Reagent", shortName: 'Schiff Reag.', accentColor: '#e11d48', liquidColor: 'rgba(225,29,72,0.1)', ringColor: 'ring-pink-400', bgColor: 'bg-pink-50' },
    { id: 'schiff-wait', name: 'Wait (observe)', shortName: 'Wait', accentColor: '#be123c', liquidColor: 'rgba(190,18,60,0.08)', ringColor: 'ring-rose-400', bgColor: 'bg-rose-50' },
  ],
  unknownTypes: ['Aldehyde', 'Ketone', 'Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: "Add Schiff's Reagent first." }
    if (type === 'Aldehyde') return { visual: 'color-change', liquidColor: 'rgba(225,29,72,0.35)', description: 'Pink/magenta color restored! Aldehyde restores the color of Schiff reagent.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(225,29,72,0.05)', description: `No pink color. ${type} does not restore Schiff's reagent color.` }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain aldehyde, ketone, and alcohol.' },
    { title: "Add Schiff's Reagent", desc: "Colorless Schiff's reagent (decolorized fuchsin) turns pink with aldehydes." },
    { title: 'Observe Color', desc: 'Pink/magenta = Aldehyde. No color = Ketone or Alcohol.' },
  ],
  reactionKey: [
    { type: 'Aldehyde', results: ['Pink/magenta color restored'], color: 'bg-pink-50', textColor: 'text-pink-700' },
    { type: 'Ketone', results: ['No pink color'], color: 'bg-gray-50', textColor: 'text-gray-700' },
    { type: 'Alcohol', results: ['No pink color'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    "Schiff's reagent is decolorized fuchsin (rosaniline). Aldehydes react to restore the magenta color.",
    'Ketones and alcohols do not restore the color.',
    'This is one of the most sensitive tests for aldehydes.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "schiff-test",
  title: "Schiff",
  emoji: "\ud83d\udc97",
  blurb: "Schiff's reagent restores pink/magenta colour with aldehydes only.",
  gradient: "from-pink-400 to-rose-500",
  durationMin: 4,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "aldehydes-ketones-and-carboxylic-acids",
};

const module = { manifest, test: schiffTest };
export default module;
