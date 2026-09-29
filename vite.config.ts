import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: ['src/index.ts', 'src/core/index.ts'],
      formats: ['es'],
    },
    minify: true,
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
});
