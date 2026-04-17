from dataclasses import dataclass
from typing import List


# Simple container for one uploaded document.
@dataclass
class StoredDocument:
    filename: str
    content: str


class InMemoryRagStore:
    def __init__(self) -> None:
        # Holds uploaded docs for the current server process only.
        self._docs: List[StoredDocument] = []

    def clear_documents(self) -> None:
        # Reset the in-memory store so old uploads do not bleed into new chats.
        self._docs = []

    def add_document(self, filename: str, content: str) -> None:
        self._docs.append(StoredDocument(filename=filename, content=content))

    def list_documents(self) -> list[StoredDocument]:
        return self._docs

    def build_context(self, max_chars: int = 6000):
        """
        Build one prompt context string from the currently stored documents.

        v1 behavior:
        - use the currently uploaded document set
        - trim total context to a simple character limit
        """
        selected_chunks = []
        sources = []
        current_size = 0

        for doc in self._docs:
            remaining = max_chars - current_size
            if remaining <= 0:
                break

            chunk = doc.content[:remaining]
            if not chunk:
                continue

            selected_chunks.append(f"Source: {doc.filename}\n{chunk}")
            sources.append({
                "name": doc.filename,
                "snippet": chunk[:180].replace("\n", " ")
            })
            current_size += len(chunk)

        context = "\n\n---\n\n".join(selected_chunks)
        return context, sources


rag_store = InMemoryRagStore()