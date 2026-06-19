// ─── Experiment Registry ─────────────────────────────────────────────────────
// Lists every available experiment. To add a new experiment:
//   1. Create a folder: src/experiments/<class>/<subject>/<chapter>/<exp-id>/index.ts
//   2. Add 2 entries below: import + push into MODULES
//
// Adding an experiment only touches THIS file (2 lines) + the new folder.
// Existing experiments are never disturbed.

import type { ExperimentManifest, ExperimentModule, SubjectId } from "@/lib/lab-types";

// ─── Static imports (one per experiment module) ──────────────────────────────

import hinsbergTest from "@/experiments/class-12/chemistry/amines/hinsberg-test";
import carbylamineTest from "@/experiments/class-12/chemistry/amines/carbylamine-test";
import nitrousAcidTest from "@/experiments/class-12/chemistry/amines/nitrous-acid-test";
import azoDyeTest from "@/experiments/class-12/chemistry/amines/azo-dye-test";

import lucasTest from "@/experiments/class-12/chemistry/alcohols-phenols-and-ethers/lucas-test";
import chromicAcidTest from "@/experiments/class-12/chemistry/alcohols-phenols-and-ethers/chromic-acid-test";
import victorMeyerTest from "@/experiments/class-12/chemistry/alcohols-phenols-and-ethers/victor-meyer-test";
import cericAmmoniumNitrateTest from "@/experiments/class-12/chemistry/alcohols-phenols-and-ethers/ceric-ammonium-nitrate-test";
import ferricChlorideTest from "@/experiments/class-12/chemistry/alcohols-phenols-and-ethers/ferric-chloride-test";
import bromineWaterTest from "@/experiments/class-12/chemistry/alcohols-phenols-and-ethers/bromine-water-test";
import libermannNitrosoTest from "@/experiments/class-12/chemistry/alcohols-phenols-and-ethers/libermann-nitroso-test";

import tollensTest from "@/experiments/class-12/chemistry/aldehydes-ketones-and-carboxylic-acids/tollens-test";
import fehlingsTest from "@/experiments/class-12/chemistry/aldehydes-ketones-and-carboxylic-acids/fehlings-test";
import schiffTest from "@/experiments/class-12/chemistry/aldehydes-ketones-and-carboxylic-acids/schiff-test";
import dnpTest from "@/experiments/class-12/chemistry/aldehydes-ketones-and-carboxylic-acids/2-4-dnp-test";
import iodoformTest from "@/experiments/class-12/chemistry/aldehydes-ketones-and-carboxylic-acids/iodoform-test";
import nahco3Test from "@/experiments/class-12/chemistry/aldehydes-ketones-and-carboxylic-acids/nahco3-test";
import esterTest from "@/experiments/class-12/chemistry/aldehydes-ketones-and-carboxylic-acids/ester-test";

import indicatorHunt from "@/experiments/class-10/science/acids-bases-and-salts/indicator-hunt";

// ─── All experiment modules (full TestDef + manifest) ────────────────────────

export const MODULES: ExperimentModule[] = [
  // ─── Class 10 · Science · Acids, Bases and Salts ───────────────────────────
  indicatorHunt,

  // ─── Class 12 · Chemistry · Amines ────────────────────────────────────────
  hinsbergTest,
  carbylamineTest,
  nitrousAcidTest,
  azoDyeTest,

  // ─── Class 12 · Chemistry · Alcohols, Phenols and Ethers ──────────────────
  lucasTest,
  chromicAcidTest,
  victorMeyerTest,
  cericAmmoniumNitrateTest,
  ferricChlorideTest,
  bromineWaterTest,
  libermannNitrosoTest,

  // ─── Class 12 · Chemistry · Aldehydes, Ketones and Carboxylic Acids ───────
  tollensTest,
  fehlingsTest,
  schiffTest,
  dnpTest,
  iodoformTest,
  nahco3Test,
  esterTest,
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────

export function getAllManifests(): ExperimentManifest[] {
  return MODULES.map((m) => m.manifest);
}

export function getExperimentsForChapter(
  classId: string,
  subjectId: SubjectId | string,
  chapterSlug: string
): ExperimentManifest[] {
  return MODULES.filter(
    (m) => m.manifest.classId === classId && m.manifest.subjectId === subjectId && m.manifest.chapterSlug === chapterSlug
  ).map((m) => m.manifest);
}

export function getExperiment(
  classId: string,
  subjectId: SubjectId | string,
  chapterSlug: string,
  experimentId: string
): ExperimentModule | undefined {
  return MODULES.find(
    (m) =>
      m.manifest.classId === classId &&
      m.manifest.subjectId === subjectId &&
      m.manifest.chapterSlug === chapterSlug &&
      m.manifest.id === experimentId
  );
}

export function hasExperiments(
  classId: string,
  subjectId: SubjectId | string,
  chapterSlug: string
): boolean {
  return getExperimentsForChapter(classId, subjectId, chapterSlug).length > 0;
}
