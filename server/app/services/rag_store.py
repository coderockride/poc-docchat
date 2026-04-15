from dataclasses import dataclass
from typing import List


@dataclass
class StoredDocument:
    filename: str
    content: str


class InMemoryRagStore:
    def __init__(self) -> None:
        self._docs: List[StoredDocument] = []

    def add_document(self, filename: str, content: str) -> None:
        self._docs.append(StoredDocument(filename=filename, content=content))

    def list_documents(self) -> list[StoredDocument]:
        return self._docs

    def build_context(self, max_chars: int = 6000):
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
