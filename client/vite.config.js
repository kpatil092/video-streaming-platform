import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    server: {
      open: '/home',
      proxy: command === 'serve' ? {
        "/api/v1": {
          target: "http://localhost:3000", // local backend URL
          changeOrigin: true,
        },
      } : undefined,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "build", // Ensure this matches your publish directory
    }
  };
});
