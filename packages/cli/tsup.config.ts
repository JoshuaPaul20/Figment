import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { cli: 'src/cli.ts' },
  format: ['esm', 'cjs'],
  target: 'node18',
  clean: true,
  dts: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  bundle: true,
  platform: 'node',
  outDir: 'dist',
  banner: {
    js: '#!/usr/bin/env node'
  },
  external: [
    // Keep these as external dependencies (not bundled)
    'gray-matter',
    '@modelcontextprotocol/sdk'
  ]
});