import { useState } from "react";

const API = "http://localhost:8000";

export default function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  async function send() {
    if (!message) return;

    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);

    const res = await fetch(`${API}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    setChat([
      ...newChat,
      { role: "assistant", content: data.answer }
    ]);

    setMessage("");
  }

  async function upload(e) {
    const files = e.target.files;
    const form = new FormData();
    for (const f of files) form.append("files", f);

    await fetch(`${API}/upload`, {
      method: "POST",
      body: form
    });
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>poc-docchat</h1>

      <input type="file" multiple onChange={upload} />

      <div style={{ marginTop: 20 }}>
        {chat.map((m, i) => (
          <div key={i}>
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
