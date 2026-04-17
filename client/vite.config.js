import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for the React frontend.
export default defineConfig({
  plugins: [react()],
  server: {
    // Keep the dev server on a stable port.
    port: 5173
  }
});