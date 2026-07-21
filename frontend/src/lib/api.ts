const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface IngestDetail {
  title: string;
  source_type: "resume" | "github_readme" | "portfolio";
  chunks: number;
}

export interface IngestResponse {
  status: string;
  documents_ingested: number;
  details: IngestDetail[];
}

export interface AnalyzeJobResponse {
  match_score: number;
  matched_skills: string[];
  gaps: string[];
  summary: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Check that .env.local exists and restart the dev server."
    );
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error(`Could not reach the backend at ${API_URL}. Is it running?`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`${path} failed (${response.status}): ${body || response.statusText}`);
  }

  return response.json();
}

export function triggerIngest(): Promise<IngestResponse> {
  return request<IngestResponse>("/ingest", { method: "POST" });
}

export function analyzeJob(jobDescription: string): Promise<AnalyzeJobResponse> {
  return request<AnalyzeJobResponse>("/analyze-job", {
    method: "POST",
    body: JSON.stringify({ job_description: jobDescription }),
  });
}
