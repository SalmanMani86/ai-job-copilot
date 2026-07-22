from fastapi import APIRouter, HTTPException

from app.services import chunking, embeddings, sources, vector_store

router = APIRouter()


@router.post("/ingest")
def ingest():
    try:
        vector_store.clear_all_documents()
        documents = sources.get_all_documents()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Failed to fetch source content: {exc}") from exc

    summary = []
    for document in documents:
        print(f"Processing: {document['source_type']} - {document['title']}")
        try:
            chunks = chunking.chunk_document(document)
            texts = [chunk["content"] for chunk in chunks]
            vectors = embeddings.embed_texts(texts)

            document_id = vector_store.save_document(document)
            vector_store.save_chunks(document_id, chunks, vectors)
        except Exception as exc:
            raise HTTPException(
                status_code=503,
                detail=f"Failed while processing '{document['title']}' ({document['source_type']}): {exc}",
            ) from exc

        summary.append(
            {
                "title": document["title"],
                "source_type": document["source_type"],
                "chunks": len(chunks),
            }
        )

    return {
        "status": "ok",
        "documents_ingested": len(documents),
        "details": summary,
    }
