import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/tests/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: "./setupTests.ts",
    coverage: {
      provider: "v8", // or "istanbul" if you prefer
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
    },
  },
});
