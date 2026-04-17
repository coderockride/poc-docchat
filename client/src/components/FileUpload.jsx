import { useState } from "react";

export default function FileUpload({ onUpload }) {
  // Store the files the user selected before submitting.
  const [files, setFiles] = useState([]);

  function handleChange(event) {
    setFiles(Array.from(event.target.files || []));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (files.length > 0) {
      onUpload(files);
    }
  }

  return (
    <div className="card">
      <h3>Upload documents</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple accept=".txt,.md" onChange={handleChange} />
        <button type="submit">Upload</button>
      </form>
      <small>
        Version 1 supports .txt and .md. Uploading new files replaces the previous set.
      </small>
    </div>
  );
}