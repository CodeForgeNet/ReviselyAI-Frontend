import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    include: ["react-pdf"],
    exclude: ["pdfjs-dist"],
  },
  server: {
    fs: {
      allow: [".."],
      strict: false,
    },
  },
  resolve: {
    
  },
});
