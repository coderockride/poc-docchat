import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

// Mount the main React app into the HTML root container.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);