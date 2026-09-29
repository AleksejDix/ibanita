/// <reference types="node" />
// Every `// returns <value>` line in a doc comment is followed by an `ibanita.<function>(...)` call.
// This test evaluates each call and compares it with the documented value, so the examples cannot drift.
import * as ibanita from '../src/index';
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(__dirname, '..', 'src');
const EXAMPLE = /^ \* \/\/ returns (?<expected>.+)\n(?: \* \/\/[^\n]*\n)* \* (?<call>ibanita\.\w+\(.*\));$/gmu;

function sourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'countries') {
      files.push(...sourceFiles(path));
    } else if (entry.name.endsWith('.ts')) {
      files.push(path);
    }
  }
  return files;
}

function evaluate(expression: string): unknown {
  // Evaluating the library's own doc examples is the point of this test.
  // oxlint-disable-next-line no-new-func, typescript/no-implied-eval, typescript/no-unsafe-call
  return new Function('ibanita', `return (${expression});`)(ibanita);
}

const examples: (readonly [name: string, expected: string, call: string])[] = [];
for (const file of sourceFiles(SRC)) {
  for (const match of readFileSync(file, 'utf8').matchAll(EXAMPLE)) {
    const call = match.groups?.['call'] ?? '';
    examples.push([`${file.slice(SRC.length + 1)}: ${call}`, match.groups?.['expected'] ?? '', call]);
  }
}

describe('doc examples', () => {
  it('are found', () => {
    expect(examples.length).toBeGreaterThan(20);
  });
  it.each(examples)('%s', (_name, expected, call) => {
    expect(evaluate(call)).toEqual(evaluate(expected));
  });
});
