// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const iodoformTest: TestDef = {
  id: 'iodoform',
  name: 'Iodoform Test',
  category: 'Aldehydes & Ketones',
  emoji: '🧈',
  gradient: 'from-lime-400 to-yellow-500',
  desc: 'I₂/NaOH gives yellow precipitate of CHI₃ with methyl ketones and ethanol. Has antiseptic smell!',
  reagents: [
    { id: 'i2', name: 'Iodine Solution', shortName: 'I₂', accentColor: '#65a30d', liquidColor: 'rgba(101,163,13,0.25)', ringColor: 'ring-lime-400', bgColor: 'bg-lime-50' },
    { id: 'naoh-i', name: 'NaOH Solution', shortName: 'NaOH', accentColor: '#2563eb', liquidColor: 'rgba(37,99,235,0.15)', ringColor: 'ring-blue-400', bgColor: 'bg-blue-50' },
  ],
  unknownTypes: ['Ethanol/CH₃CHO', 'Methyl Ketone', 'Other Ketone'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add I₂ solution first.' }
    if (r1 && !r2) return { visual: 'no-reaction', liquidColor: 'rgba(101,163,13,0.15)', description: 'I₂ added. Now add NaOH to complete the test.' }
    if (type === 'Ethanol/CH₃CHO') return { visual: 'precipitate', precipitateColor: '#facc15', liquidColor: 'rgba(250,204,21,0.3)', smellType: 'antiseptic', description: 'Yellow precipitate of CHI₃ (iodoform)! Antiseptic smell. CH₃CH₂OH or CH₃CHO detected.' }
    if (type === 'Methyl Ketone') return { visual: 'precipitate', precipitateColor: '#facc15', liquidColor: 'rgba(250,204,21,0.3)', smellType: 'antiseptic', description: 'Yellow precipitate of CHI₃! Methyl ketone (CH₃CO-) detected. Antiseptic smell.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(101,163,13,0.1)', description: 'No yellow precipitate. This compound does not have a CH₃CO- or CH₃CH(OH)- group.' }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain ethanol/acetaldehyde, methyl ketone, and other ketone.' },
    { title: 'Add I₂ + NaOH', desc: 'I₂/NaOH gives yellow CHI₃ precipitate with CH₃CO- or CH₃CH(OH)- groups.' },
    { title: 'Observe Precipitate', desc: 'Yellow ppt + antiseptic smell = Positive. No ppt = Negative.' },
  ],
  reactionKey: [
    { type: 'Ethanol/CH₃CHO', results: ['Yellow CHI₃ precipitate + antiseptic smell'], color: 'bg-lime-50', textColor: 'text-lime-700' },
    { type: 'Methyl Ketone', results: ['Yellow CHI₃ precipitate + antiseptic smell'], color: 'bg-yellow-50', textColor: 'text-yellow-700' },
    { type: 'Other Ketone', results: ['No yellow precipitate'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    'Compounds with CH₃CO- group (methyl ketones) or CH₃CH(OH)- group (ethanol) give the iodoform test.',
    'I₂/NaOH oxidizes and iodinates the methyl group, forming yellow CHI₃ (iodoform) with a characteristic antiseptic smell.',
    'Other ketones (without CH₃CO- group) do not give this test.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "iodoform-test",
  title: "Iodoform Test",
  emoji: "\ud83e\uddc8",
  blurb: "Iodoform test: yellow ppt with CH\u2083CO- group & CH\u2083CH(OH)- group (NaOH + I\u2082).",
  gradient: "from-lime-400 to-yellow-500",
  durationMin: 6,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "aldehydes-ketones-and-carboxylic-acids",
};

const module = { manifest, test: iodoformTest };
export default module;
