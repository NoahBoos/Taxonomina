import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    root: path.resolve(__dirname, "src"), // dossier contenant index.html, preload.ts, renderer.ts
    base: "./", // chemins relatifs corrects pour Electron
    build: {
        outDir: path.resolve(__dirname, "dist/views/pages/index/renderer"), // output final
        emptyOutDir: true,
        target: "esnext", // moderne pour Electron
        minify: false, // pratique pour debug
        rollupOptions: {
            input: path.resolve(__dirname, "src/views/pages/index/renderer.ts"), // uniquement ton renderer
            output: {
                format: "es", // ES Module pour navigateur
                entryFileNames: "renderer.js", // nom du bundle final
            }
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    }
});