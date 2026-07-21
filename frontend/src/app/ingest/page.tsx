"use client";

import { triggerIngest } from "@/lib/api";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { Button, Card } from "@/components/ui";
import { PageHeader } from "@/components/PageHeader";

export default function IngestPage() {
  const { data: result, error, isLoading, run } = useAsyncAction(triggerIngest);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <PageHeader
        title="Ingest your content"
        description="Pulls your resume, GitHub READMEs, and portfolio page, then chunks and embeds everything into the knowledge base. This can take up to a minute."
      />

      <Button onClick={() => run()} disabled={isLoading} className="mt-6">
        {isLoading ? "Ingesting…" : "Run ingestion"}
      </Button>

      {error && (
        <p role="alert" className="mt-6 text-sm text-red-400">
          {error}
        </p>
      )}

      {result && (
        <Card className="mt-8" aria-live="polite">
          <p className="text-sm font-medium text-emerald-400">
            {result.documents_ingested} documents ingested
          </p>
          <ul className="mt-4 space-y-2">
            {result.details.map((doc, index) => (
              <li
                key={`${doc.source_type}-${doc.title}-${index}`}
                className="flex items-center justify-between border-b border-zinc-800 pb-2 text-sm last:border-0"
              >
                <span className="text-zinc-200">{doc.title}</span>
                <span className="text-zinc-500">
                  {doc.source_type} · {doc.chunks} chunks
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
