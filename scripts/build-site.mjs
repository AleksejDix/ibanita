#!/usr/bin/env node
// Builds site/index.html into dist-site/index.html with the library bundled inline as the global `ibanita`,
// so the page runs the exact code the package ships and needs no server or network for the logic.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from 'vite';

const result = await build({
  configFile: false,
  logLevel: 'silent',
  build: {
    write: false,
    minify: true,
    lib: { entry: resolve('src/index.ts'), formats: ['iife'], name: 'ibanita', fileName: 'ibanita' },
  },
});
const bundle = result[0].output.find((item) => item.type === 'chunk').code.replaceAll('</script', '<\\/script');
const page = readFileSync('site/index.html', 'utf8');
if (!page.includes('/*__IBANITA__*/')) throw new Error('site/index.html has no /*__IBANITA__*/ placeholder');
mkdirSync('dist-site', { recursive: true });
writeFileSync('dist-site/index.html', page.replace('/*__IBANITA__*/', () => bundle));
console.log(`dist-site/index.html written, library ${(bundle.length / 1024).toFixed(1)} kB`);
