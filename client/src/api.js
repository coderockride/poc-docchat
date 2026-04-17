const API_BASE = "http://127.0.0.1:8000";

// Upload one or more files to the backend.
export async function uploadFiles(files) {
  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to upload files.");
  }

  return response.json();
}

// Send a chat message to the backend.
export async function sendChat(message) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to send message.");
  }

  return response.json();
}