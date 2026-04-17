from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
from pydantic import BaseModel
import os

from app.services.rag_store import rag_store

# Load environment variables from server/.env for local development.
load_dotenv()

app = FastAPI(title="poc-docchat API")

# Allow the local React frontend to call this API during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    """Request body for a user chat message."""
    message: str


class SourceItem(BaseModel):
    """Small source preview returned to the frontend."""
    name: str
    snippet: str


class ChatResponse(BaseModel):
    """Structured response returned from the chat endpoint."""
    answer: str
    sources: list[SourceItem]


@app.get("/health")
def health_check():
    """Simple endpoint to verify the backend is running."""
    return {"status": "ok"}


@app.post("/upload")
async def upload_files(files: list[UploadFile] = File(...)):
    """
    Accept uploaded text or markdown files.

    Version 1 rules:
    - only .txt and .md files are supported
    - documents are stored in memory only
    - each new upload replaces the previous document set
    """
    saved = []

    # Important v1 behavior:
    # treat each upload action as a fresh document set so old files do not
    # continue influencing later answers.
    rag_store.clear_documents()

    for file in files:
        if not file.filename:
            continue

        if not (file.filename.endswith(".txt") or file.filename.endswith(".md")):
            raise HTTPException(
                status_code=400,
                detail="Only .txt and .md files are supported in v1."
            )

        raw = await file.read()

        try:
            content = raw.decode("utf-8")
        except UnicodeDecodeError as exc:
            raise HTTPException(
                status_code=400,
                detail=f"Could not decode {file.filename} as UTF-8 text."
            ) from exc

        rag_store.add_document(file.filename, content)

        saved.append({
            "filename": file.filename,
            "preview": content[:150].replace("\n", " ")
        })

    return {"files": saved}


@app.post("/chat", response_model=ChatResponse)
def chat(body: ChatRequest):
    """
    Answer a user question using the currently uploaded document context.

    v1 approach:
    - build one simple context block from the current in-memory docs
    - ask the model to answer from that context
    """
    if not rag_store.list_documents():
        return ChatResponse(
            answer="Upload a document first.",
            sources=[]
        )

    question = body.message.strip()
    context, sources = rag_store.build_context()

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not configured."
        )

    client = OpenAI(api_key=api_key)

    prompt = f"""
Answer the question using the context below.
If the answer is not in the context, say you are not sure based on the uploaded files.

Question: {question}

Context:
{context}
"""

    try:
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            input=prompt,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"OpenAI request failed: {exc}"
        ) from exc

    return ChatResponse(
        answer=response.output_text,
        sources=[SourceItem(**source) for source in sources]
    )