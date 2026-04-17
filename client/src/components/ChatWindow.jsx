import { useState } from "react";

export default function ChatWindow({ messages, onSend, isLoading }) {
  // Track the current value of the chat input.
  const [input, setInput] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setInput("");
  }

  return (
    <div className="chat-shell">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-role">{message.role}</div>
            <div>{message.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant">
            <div className="message-role">assistant</div>
            <div>Thinking...</div>
          </div>
        )}
      </div>

      <form className="composer" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question about your uploaded files..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}