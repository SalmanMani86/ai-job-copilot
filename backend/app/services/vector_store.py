from app.db.supabase_client import get_supabase


def clear_all_documents() -> None:
    supabase = get_supabase()
    supabase.table("documents").delete().neq("id", 0).execute()


def save_document(document: dict) -> int:
    supabase = get_supabase()
    result = (
        supabase.table("documents")
        .insert(
            {
                "source_type": document["source_type"],
                "title": document["title"],
                "raw_text": document["raw_text"],
            }
        )
        .execute()
    )
    return result.data[0]["id"]


def save_chunks(document_id: int, chunks: list[dict], embeddings: list[list[float]]) -> None:
    if not chunks:
        return

    supabase = get_supabase()
    rows = [
        {
            "document_id": document_id,
            "content": chunk["content"],
            "chunk_index": chunk["chunk_index"],
            "embedding": embedding,
        }
        for chunk, embedding in zip(chunks, embeddings)
    ]
    supabase.table("chunks").insert(rows).execute()


def search_similar_chunks(query_embedding: list[float], match_count: int = 10) -> list[dict]:
    supabase = get_supabase()
    result = supabase.rpc(
        "match_chunks",
        {"query_embedding": query_embedding, "match_count": match_count},
    ).execute()
    return result.data


def save_job_analysis(job_description: str, match_score: int, matched_skills: list[str], gaps: list[str]) -> None:
    supabase = get_supabase()
    supabase.table("job_analyses").insert(
        {
            "job_description": job_description,
            "match_score": match_score,
            "matched_skills": matched_skills,
            "gaps": gaps,
        }
    ).execute()
