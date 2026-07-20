from fastapi import APIRouter

from app.services import chunking, embeddings, sources, vector_store

router = APIRouter()


@router.post("/ingest")
def ingest():
    vector_store.clear_all_documents()

    documents = sources.get_all_documents()

    summary = []
    for document in documents:
        print(f"Processing: {document['source_type']} - {document['title']}")
        chunks = chunking.chunk_document(document)
        texts = [chunk["content"] for chunk in chunks]
        vectors = embeddings.embed_texts(texts)

        document_id = vector_store.save_document(document)
        vector_store.save_chunks(document_id, chunks, vectors)

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
