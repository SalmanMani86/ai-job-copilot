"use client";

import { useId, useState } from "react";
import { analyzeJob } from "@/lib/api";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { Button, Card, Chip } from "@/components/ui";
import { PageHeader } from "@/components/PageHeader";
import { LoadingStatus } from "@/components/LoadingStatus";

function scoreTone(score: number): "success" | "warning" {
  return score >= 70 ? "success" : "warning";
}

export default function AnalyzePage() {
  const [jobDescription, setJobDescription] = useState("");
  const { data: result, error, isLoading, elapsedSeconds, run } = useAsyncAction(analyzeJob);
  const textareaId = useId();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <PageHeader
        title="Analyze a job posting"
        description="Paste a job description below to see how well it matches your real experience."
      />

      <label htmlFor={textareaId} className="sr-only">
        Job description
      </label>
      <textarea
        id={textareaId}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here…"
        rows={10}
        className="mt-6 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
      />

      <Button
        onClick={() => run(jobDescription)}
        disabled={isLoading || !jobDescription.trim()}
        className="mt-4"
      >
        {isLoading ? "Analyzing…" : "Analyze match"}
      </Button>

      {isLoading && <LoadingStatus elapsedSeconds={elapsedSeconds} baseLabel="Searching your experience…" />}

      {error && (
        <p role="alert" className="mt-6 text-sm text-red-400">
          {error}
        </p>
      )}

      {result && (
        <Card className="mt-8 space-y-6" aria-live="polite">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-semibold text-zinc-50">{result.match_score}%</div>
            <Chip tone={scoreTone(result.match_score)}>
              {result.match_score >= 70 ? "Strong match" : "Partial match"}
            </Chip>
          </div>

          <p className="text-sm leading-6 text-zinc-300">{result.summary}</p>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Matched skills
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.matched_skills.map((skill, index) => (
                <Chip key={`${skill}-${index}`} tone="success">
                  {skill}
                </Chip>
              ))}
            </div>
          </div>

          {result.gaps.length > 0 && (
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">Gaps</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.gaps.map((gap, index) => (
                  <Chip key={`${gap}-${index}`} tone="warning">
                    {gap}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
