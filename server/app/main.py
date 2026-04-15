from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.services.rag_store import rag_store
from openai import OpenAI
import os

app = FastAPI(title="poc-docchat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/upload")
async def upload_files(files: list[UploadFile] = File(...)):
    saved = []

    for file in files:
        if not file.filename.endswith(".txt") and not file.filename.endswith(".md"):
            raise HTTPException(status_code=400, detail="Only .txt and .md supported for now")

        content = (await file.read()).decode("utf-8")
        rag_store.add_document(file.filename, content)

        saved.append({
            "filename": file.filename,
            "preview": content[:150]
        })

    return {"files": saved}


@app.post("/chat")
def chat(body: dict):
    if not rag_store.list_documents():
        return {"answer": "Upload a document first.", "sources": []}

    question = body.get("message", "")
    context, sources = rag_store.build_context()

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    prompt = f"""
Answer the question using the context below.

Question: {question}

Context:
{context}
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )

    return {
        "answer": response.output_text,
        "sources": sources
    }
