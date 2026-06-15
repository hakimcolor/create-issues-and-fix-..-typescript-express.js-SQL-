import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry point of the application
  entry: ['src/server.ts'],

  // Output format — CommonJS for Vercel compatibility
  format: ['cjs'],

  // Output directory
  outDir: 'dist',

  // Target Node.js version
  target: 'node20',

  // Clean dist folder before each build
  clean: true,

  // Bundle everything into a single output file
  bundle: true,

  // Skip type declarations for faster builds
  dts: false,

  // Inline sourcemaps for debugging
  sourcemap: true,
});
