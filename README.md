# poc-docchat

A small portfolio project: a React + FastAPI document chat app with a simple RAG-style architecture.

## Stack

- React + Vite
- FastAPI
- OpenAI API
- Local in-memory document store for v1
- Ready to evolve into hosted retrieval / vector store RAG

## Features

- Upload text files
- Ask questions in a chat UI
- Server combines uploaded content into context
- Returns answers with basic source references

## Run locally

### Backend

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
uvicorn app.main:app --reload
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:8000`

## Environment variables

Set these in `server/.env`:

- `OPENAI_API_KEY=your_key_here`
- `OPENAI_MODEL=gpt-4.1-mini`

## Next steps

- Replace in-memory store with OpenAI hosted retrieval
- Add PDF parsing
- Add persistent chat history
- Add citations with chunk references
- Add streaming responses
