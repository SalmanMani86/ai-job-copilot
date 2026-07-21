import Link from "next/link";
import { Card } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="text-sm font-medium text-violet-400">RAG-powered job search</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
        Know exactly how well you match, before you apply.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-zinc-400">
        This tool reads your resume, GitHub projects, and portfolio, then compares them
        against any job posting you paste in — grounded entirely in your real experience,
        never invented.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="text-base font-medium text-zinc-100">1. Ingest your content</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Pull your resume, GitHub READMEs, and portfolio into a searchable knowledge base.
          </p>
          <Link
            href="/ingest"
            className="mt-4 inline-block text-sm font-medium text-violet-400 hover:text-violet-300"
          >
            Go to Ingest &rarr;
          </Link>
        </Card>

        <Card>
          <h2 className="text-base font-medium text-zinc-100">2. Analyze a job posting</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Paste a job description and get a match score, matched skills, and honest gaps.
          </p>
          <Link
            href="/analyze"
            className="mt-4 inline-block text-sm font-medium text-violet-400 hover:text-violet-300"
          >
            Go to Analyze &rarr;
          </Link>
        </Card>
      </div>
    </div>
  );
}
