CHUNK_SIZE = 2000  # characters, roughly ~500 tokens
CHUNK_OVERLAP = 200  # roughly ~50 tokens of shared context between chunks


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    text = text.strip()
    if not text:
        return []

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        piece = text[start:end].strip()
        if piece:
            chunks.append(piece)
        if end >= len(text):
            break
        start = end - overlap

    return chunks


def chunk_document(document: dict) -> list[dict]:
    pieces = chunk_text(document["raw_text"])
    return [
        {
            "source_type": document["source_type"],
            "title": document["title"],
            "content": piece,
            "chunk_index": index,
        }
        for index, piece in enumerate(pieces)
    ]
