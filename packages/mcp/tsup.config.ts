import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm'],
  target: 'node18',
  clean: true,
  dts: true,
  project: 'tsconfig.json',
  splitting: false,
  sourcemap: false,
  minify: false,
  bundle: true,
  external: ['fs', 'path', 'url'],
  platform: 'node',
  outDir: 'dist'
});
