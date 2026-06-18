// ─── Syllabus + Registry Bridge Helpers ──────────────────────────────────────
// Combines syllabus.ts (chapter list) and registry.ts (experiments per chapter)
// for navigation UI use.

import { CLASS_META, SUBJECTS, getChapters, type SubjectId } from "@/lib/syllabus";
import { getExperimentsForChapter, getAllManifests } from "@/experiments/registry";

export { CLASS_META, SUBJECTS, getChapters };
export type { SubjectId };

// Count all live experiments for a given class (across all subjects & chapters)
export function getExperimentsForClass(classId: string) {
  return getAllManifests().filter((m) => m.classId === classId);
}

// Count live experiments for a given (class, subject)
export function getExperimentsForSubject(classId: string, subjectId: string) {
  return getAllManifests().filter((m) => m.classId === classId && m.subjectId === subjectId);
}

// Returns chapters for a (class, subject) with a flag indicating whether each
// chapter has any live experiments. Used by the chapter-list page to show
// "Coming Soon" badges on empty chapters.
export function getChaptersWithStatus(classId: string, subjectId: string) {
  const chapters = getChapters(classId, subjectId);
  return chapters.map((c) => {
    const experiments = getExperimentsForChapter(classId, subjectId, c.slug);
    return {
      ...c,
      experimentCount: experiments.length,
      hasExperiments: experiments.length > 0,
      experiments,
    };
  });
}
