#!/usr/bin/env node
// Checks the built package: every export path resolves and imports, and the gzipped size stays under the limit.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, resolve } from 'node:path';

const SIZE_LIMIT = 10 * 1024; // sum of the gzipped sizes of every JavaScript file in dist

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
let failed = false;

for (const [path, target] of Object.entries(pkg.exports)) {
  for (const file of [target.types, target.import]) {
    try {
      statSync(file);
    } catch {
      console.error(`export ${path}: missing ${file}`);
      failed = true;
    }
  }
  const mod = await import(resolve(target.import));
  console.log(`export ${path.padEnd(9)} ${Object.keys(mod).length} symbols`);
}

function jsFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = join(dir, name);
    return statSync(file).isDirectory() ? jsFiles(file) : name.endsWith('.js') ? [file] : [];
  });
}
const files = jsFiles('dist').sort();
let total = 0;
for (const file of files) {
  const size = gzipSync(readFileSync(file)).length;
  total += size;
  console.log(`${String(size).padStart(6)} ${file}`);
}
console.log(`${String(total).padStart(6)} total gzipped (limit ${SIZE_LIMIT})`);
if (total > SIZE_LIMIT) {
  console.error(`gzipped size ${total} exceeds the limit of ${SIZE_LIMIT} bytes`);
  failed = true;
}
process.exit(failed ? 1 : 0);
