from fastapi import APIRouter

from app.models.schemas import AnalyzeJobRequest, AnalyzeJobResponse
from app.services import embeddings, llm, vector_store

router = APIRouter()


@router.post("/analyze-job", response_model=AnalyzeJobResponse)
def analyze_job(request: AnalyzeJobRequest):
    query_embedding = embeddings.embed_texts([request.job_description])[0]
    matched_chunks = vector_store.search_similar_chunks(query_embedding, match_count=10)

    analysis = llm.analyze_job_match(request.job_description, matched_chunks)

    vector_store.save_job_analysis(
        job_description=request.job_description,
        match_score=analysis.match_score,
        matched_skills=analysis.matched_skills,
        gaps=analysis.gaps,
    )

    return AnalyzeJobResponse(
        match_score=analysis.match_score,
        matched_skills=analysis.matched_skills,
        gaps=analysis.gaps,
        summary=analysis.summary,
    )
