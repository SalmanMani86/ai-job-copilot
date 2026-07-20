from google import genai
from google.genai import types

from app.config import settings

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIMENSIONS = 768

_client = genai.Client(api_key=settings.gemini_api_key)


def embed_texts(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []

    response = _client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(output_dimensionality=EMBEDDING_DIMENSIONS),
    )
    return [embedding.values for embedding in response.embeddings]
