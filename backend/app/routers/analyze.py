from fastapi import APIRouter, HTTPException

from app.models.schemas import AnalyzeJobRequest, AnalyzeJobResponse
from app.services import embeddings, llm, vector_store

router = APIRouter()


@router.post("/analyze-job", response_model=AnalyzeJobResponse)
def analyze_job(request: AnalyzeJobRequest):
    try:
        query_embedding = embeddings.embed_texts([request.job_description])[0]
        matched_chunks = vector_store.search_similar_chunks(query_embedding, match_count=10)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Failed to search your knowledge base: {exc}") from exc

    if not matched_chunks:
        raise HTTPException(
            status_code=422,
            detail="No content found to compare against. Have you run /ingest yet?",
        )

    try:
        analysis = llm.analyze_job_match(request.job_description, matched_chunks)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Failed to generate analysis: {exc}") from exc

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
