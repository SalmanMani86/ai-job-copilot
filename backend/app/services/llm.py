from groq import Groq
from pydantic import BaseModel, ConfigDict

from app.config import settings

CHAT_MODEL = "openai/gpt-oss-20b"

_client = Groq(api_key=settings.groq_api_key)


class JobMatchAnalysis(BaseModel):
    model_config = ConfigDict(extra="forbid")

    match_score: int
    matched_skills: list[str]
    gaps: list[str]
    summary: str


def analyze_job_match(job_description: str, matched_chunks: list[dict]) -> JobMatchAnalysis:
    context = "\n\n---\n\n".join(chunk["content"] for chunk in matched_chunks)

    prompt = f"""You are analyzing how well a candidate's real experience matches a job posting.

CANDIDATE'S REAL EXPERIENCE (from resume, GitHub projects, and portfolio):
{context}

JOB POSTING:
{job_description}

Based ONLY on the candidate's real experience shown above, analyze the match.
Do not invent or assume experience that isn't shown above.
match_score should be 0-100. matched_skills and gaps should be short skill/keyword phrases."""

    response = _client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[{"role": "user", "content": prompt}],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "job_match_analysis",
                "schema": JobMatchAnalysis.model_json_schema(),
                "strict": True,
            },
        },
    )

    return JobMatchAnalysis.model_validate_json(response.choices[0].message.content)
