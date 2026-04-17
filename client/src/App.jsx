import { useState } from "react";
import { uploadFiles, sendChat } from "./api";
import ChatWindow from "./components/ChatWindow";
import FileUpload from "./components/FileUpload";
import SourceList from "./components/SourceList";

export default function App() {
  // Chat history shown in the main panel.
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Upload one or more text files, then ask a question about them." }
  ]);

  // Source items shown in the sidebar.
  const [sources, setSources] = useState([]);

  // Upload feedback for the user.
  const [uploadStatus, setUploadStatus] = useState("");

  // Controls the temporary "Thinking..." state.
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpload(files) {
    try {
      setUploadStatus("Uploading files...");

      // Send selected files to the backend.
      const result = await uploadFiles(files);

      // Show a simple success message in the UI.
      setUploadStatus(`Uploaded ${result.files.length} file(s).`);

      // Pre-populate the source panel with uploaded file previews.
      setSources(result.files.map((file) => ({
        name: file.filename,
        snippet: file.preview
      })));
    } catch (error) {
      setUploadStatus(error.message);
    }
  }

  async function handleSendMessage(text) {
    // Add the user message to chat immediately for snappy UI feedback.
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      // Send the message to the backend and wait for the grounded answer.
      const result = await sendChat(text);

      // Add the model response to chat history.
      setMessages([
        ...nextMessages,
        { role: "assistant", content: result.answer }
      ]);

      // Refresh sources from the backend response.
      setSources(result.sources || []);
    } catch (error) {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: `Error: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>poc-docchat</h1>
          <p>React + FastAPI document chat starter</p>
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          {/* Upload area for new documents */}
          <FileUpload onUpload={handleUpload} />

          {/* Small status panel for upload feedback */}
          <div className="status-card">
            <h3>Status</h3>
            <p>{uploadStatus || "No uploads yet."}</p>
          </div>

          {/* List of file previews / current source snippets */}
          <SourceList sources={sources} />
        </aside>

        <section className="main-panel">
          {/* Main chat interface */}
          <ChatWindow
            messages={messages}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </section>
      </main>
    </div>
  );
}