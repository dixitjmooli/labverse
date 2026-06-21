"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { getExperiment } from "@/experiments/registry";
import { ExperimentPlayer } from "@/components/lab/ExperimentPlayer";

export default function ExperimentPage({
  params,
}: {
  params: Promise<{
    classId: string;
    subjectId: string;
    chapterSlug: string;
    experimentId: string;
  }>;
}) {
  const { classId, subjectId, chapterSlug, experimentId } = use(params);
  const mod = getExperiment(classId, subjectId, chapterSlug, experimentId);
  if (!mod) return notFound();

  // Scene-based activities provide their own bespoke React component.
  // Everything else falls back to the generic test-tube ExperimentPlayer.
  if (mod.Component) {
    const C = mod.Component;
    return <C manifest={mod.manifest} />;
  }
  if (mod.test) {
    return <ExperimentPlayer test={mod.test} manifest={mod.manifest} />;
  }
  return notFound();
}
