// ─── Shared Lab Types ────────────────────────────────────────────────────────
// Used by every experiment module + the generic experiment player.

export type ReactionVisual =
  | "precipitate"
  | "color-change"
  | "silver-mirror"
  | "foul-smell"
  | "fruity-smell"
  | "antiseptic-smell"
  | "effervescence"
  | "turbidity"
  | "oily-layer"
  | "no-reaction"
  | "dissolve"
  | "decolorize"
  | "dye";

export interface ReactionResult {
  visual: ReactionVisual;
  precipitateColor?: string;
  liquidColor: string;
  description: string;
  smellType?: "foul" | "fruity" | "antiseptic";
  turbiditySpeed?: "immediate" | "slow" | "none";
}

export interface ReagentDef {
  id: string;
  name: string;
  shortName: string;
  accentColor: string;
  liquidColor: string;
  ringColor: string;
  bgColor: string;
  /**
   * Optional category label used to group reagents visually in the player.
   * Common values: "natural" | "synthetic" | "olfactory".
   * When ANY reagent on a test has a category, the player renders reagents
   * in labelled sections (one per unique category, in array order).
   * When no reagent has a category, the player falls back to a flat row.
   */
  category?: string;
}

export interface IntroStep {
  title: string;
  desc: string;
}

export interface ReactionKeyEntry {
  type: string;
  results: string[];
  color: string; // tailwind bg color
  textColor: string;
}

export interface TestDef {
  id: string;
  name: string;
  category: string;
  emoji: string;
  gradient: string;
  desc: string;
  reagents: ReagentDef[];
  unknownTypes: string[];
  /**
   * Legacy 2-reagent reaction function (used by all pre-existing experiments).
   * Takes booleans for whether reagent[0] and reagent[1] were added.
   */
  getReaction: (unknownType: string, r1Added: boolean, r2Added: boolean) => ReactionResult;
  /**
   * Optional N-reagent reaction function (used by experiments with >2 reagents,
   * e.g. the Indicator Hunt game). Takes the array of added reagent IDs.
   * When present, the player uses this instead of `getReaction`.
   */
  getReactionMulti?: (unknownType: string, addedReagentIds: string[]) => ReactionResult;
  introSteps: IntroStep[];
  reactionKey: ReactionKeyEntry[];
  recap: string[];
  /**
   * Optional multiple-choice options shown in the Identify phase.
   * When absent, the Identify phase falls back to `unknownTypes` (legacy behaviour).
   * When present, this is the source of truth for the option buttons — useful for
   * single-tube activity simulations where `unknownTypes` has only ONE entry
   * (the actual answer) but the player needs to choose from several options.
   */
  identifyOptions?: string[];
}

// ─── Experiment Manifest (registry entry) ────────────────────────────────────
// Each experiment module exports a `TestDef` plus this manifest metadata so the
// navigation tree can list it without loading the heavy TestDef / sound engine.

export interface ExperimentManifest {
  id: string;            // URL-safe unique id, e.g. "hinsberg-test"
  title: string;         // Display title
  emoji: string;
  blurb: string;         // 1-line description shown on the experiment-list card
  gradient: string;      // tailwind gradient for the card
  durationMin: number;   // estimated minutes
  classId: string;       // "9" | "10" | "11" | "12"
  subjectId: SubjectId;
  chapterSlug: string;   // must match a chapter slug in syllabus.ts
}

export type SubjectId = "science" | "maths" | "physics" | "chemistry" | "biology";

export interface ExperimentModule {
  manifest: ExperimentManifest;
  test: TestDef;
}
