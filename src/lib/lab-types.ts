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
  getReaction: (unknownType: string, r1Added: boolean, r2Added: boolean) => ReactionResult;
  introSteps: IntroStep[];
  reactionKey: ReactionKeyEntry[];
  recap: string[];
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
