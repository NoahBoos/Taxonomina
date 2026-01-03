import { defineConfig } from 'vite';
import path from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
    root: path.resolve(__dirname, "src/renderer"),
    base: "./",
    plugins: [
        svelte()
    ],
    build: {
        outDir: path.resolve(__dirname, "dist/renderer"),
        emptyOutDir: true,
        target: "esnext",
        minify: false,
        rollupOptions: {
            input: path.resolve(__dirname, "src/renderer/pages/index/index.html")
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    }
});