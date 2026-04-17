# poc-docchat

A small portfolio project that demonstrates a document-aware chat application built with React and FastAPI.

## What it does

- Upload `.txt` and `.md` files
- Ask questions about uploaded documents
- Send document context to the OpenAI API
- Return an answer along with simple source previews

## Why this project exists

This repo is a version 1 prototype for a retrieval-augmented chat app.

The goal of v1 is not to build a production-grade RAG system yet. The goal is to show the full application loop:

- frontend chat experience
- backend API
- file upload flow
- grounded prompting against user-provided content
- clean project structure for future iteration

## Tech stack

- React + Vite
- FastAPI
- OpenAI API
- In-memory document store for v1

## Current limitations

This is intentionally a simple prototype:

- only `.txt` and `.md` files are supported
- uploaded files are stored in memory only
- each new upload replaces the previous document set
- no authentication
- no persistent chat history
- no chunk retrieval or ranking yet
- no PDF parsing yet

## Planned v2 improvements

- document chunking
- real retrieval instead of prompt stuffing
- vector store or hosted retrieval integration
- PDF support
- better citations
- persistent conversations

## Local development

### Backend

Create a virtual environment and install dependencies:

```bash
cd server
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `server/.env` if you do not already have one:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
```

If `server/.env` already exists, keep using it.

Run the API:

```bash
python -m uvicorn app.main:app --reload
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Open:

- Frontend: http://localhost:5173
- Backend health check: http://127.0.0.1:8000/health

## Example test file

```txt
Acme Biotech launched Project Iris in 2024.
The project focuses on clinical trial analytics for oncology.
The internal sponsor is Dr. Elena Park.
```

Example question:

`Who is the internal sponsor for Project Iris?`
