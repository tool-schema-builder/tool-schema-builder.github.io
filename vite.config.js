import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "tool-schema-builder.github.io",
  plugins: [react()],
  build: {
    outDir: 'build', // Output directory for the build
    emptyOutDir: true, // Clears the output directory before building
  },
});