from pydantic import BaseModel


class AnalyzeJobRequest(BaseModel):
    job_description: str


class AnalyzeJobResponse(BaseModel):
    match_score: int
    matched_skills: list[str]
    gaps: list[str]
    summary: str
