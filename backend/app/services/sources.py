import base64
from pathlib import Path

import httpx
from bs4 import BeautifulSoup
from pypdf import PdfReader

from app.config import settings

RESUME_PATH = Path(__file__).resolve().parents[2] / "data" / "resume.pdf"

GITHUB_API = "https://api.github.com"


def get_resume_document() -> dict:
    reader = PdfReader(RESUME_PATH)
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    return {"source_type": "resume", "title": "Resume", "raw_text": text}


def get_github_readme_documents() -> list[dict]:
    headers = {
        "Authorization": f"Bearer {settings.github_token}",
        "Accept": "application/vnd.github+json",
    }
    with httpx.Client(headers=headers, timeout=15) as client:
        repos_response = client.get(
            f"{GITHUB_API}/users/{settings.github_username}/repos",
            params={"per_page": 100},
        )
        repos_response.raise_for_status()
        repos = repos_response.json()

        documents = []
        for repo in repos:
            if repo.get("fork"):
                continue

            readme_response = client.get(
                f"{GITHUB_API}/repos/{settings.github_username}/{repo['name']}/readme"
            )
            if readme_response.status_code != 200:
                continue

            readme_json = readme_response.json()
            content = base64.b64decode(readme_json["content"]).decode("utf-8", errors="ignore")
            documents.append(
                {
                    "source_type": "github_readme",
                    "title": repo["name"],
                    "raw_text": content,
                }
            )

        return documents


def get_portfolio_document() -> dict:
    with httpx.Client(timeout=15) as client:
        response = client.get(settings.portfolio_url)
        response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    for tag in soup(["script", "style"]):
        tag.decompose()
    text = soup.get_text(separator="\n", strip=True)

    return {"source_type": "portfolio", "title": "Portfolio", "raw_text": text}


def get_all_documents() -> list[dict]:
    documents = [get_resume_document()]
    documents.extend(get_github_readme_documents())
    documents.append(get_portfolio_document())
    return documents
