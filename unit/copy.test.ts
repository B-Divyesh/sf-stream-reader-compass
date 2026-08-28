import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

describe('plain-language release copy', () => {
  test('uses the reviewed README rewrite and result-naming headings', () => {
    const readme = readFileSync('README.md', 'utf8');
    const site = readFileSync('site/src/main.ts', 'utf8');
    expect(readme).toContain('It turns visible chat messages into a local transcript with lasting message headings, named links, and copy controls.');
    expect(readme).toContain('You can export the transcript and save your place.');
    expect(readme).not.toContain('text export, and a saved place');
    expect(site).toContain('Preview of a stable transcript');
    expect(site).toContain('Page not found');
    expect(site).toContain('Exit demo and install extension');
    expect(site).toContain('Browser extension for screen-reader users');
    expect(site).toContain('Transcript preview · first 2 of 4 messages');
    expect(site).toContain('How to turn a live chat into a transcript');
    expect(site).toContain('Navigate, save, copy, or export');
    expect(site).toContain('The reader numbers visible chat messages in their page order.');
    expect(site).toContain('Go to previous message');
    expect(site).toContain('Go to next message');
    expect(site).not.toContain('reading record');
    expect(readme).toContain('The reader announces new messages without interrupting you or moving focus.');
    expect(readme).toContain('The website loads scripts, styles, and fonts only from its own domain.');
    expect(readme).not.toContain('polite announcements');
    expect(readme).not.toContain('runtime dependencies');
    expect(readme).not.toContain('Chrome-compatible');
    expect(readme).not.toContain('Alt</kbd>');
    expect(site).not.toContain('Press Alt+Shift+R');
    expect(site).not.toContain('Chrome-compatible');
    expect(site).not.toContain('Edition 404');
    expect(site).not.toContain('Read and act');
    expect(site).not.toContain('Loose chat fragments');
    expect(site).not.toContain('Remove the extension to delete its local data');
  });

  test('keeps the catalog description verb-first and within 120 characters', () => {
    const description = readFileSync('.factory/catalog-description.txt', 'utf8').trim();
    expect(description.length).toBeLessThanOrEqual(120);
    expect(description).toMatch(/^Read\b/);
  });

  test('lists each public claim once and maps it to exactly one tagged test', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string; test: string }>;
    const testSources = [
      readFileSync('tests/claims.spec.ts', 'utf8'),
      readFileSync('tests/extension.spec.ts', 'utf8'),
      readFileSync('tests/accessibility.spec.ts', 'utf8')
    ].join('\n');
    expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);
    for (const { id, test } of claims) {
      expect(test).toBe(`npm test -- --grep @claim:${id}`);
      expect(testSources.match(new RegExp(`@claim:${id}(?![a-z0-9-])`, 'g'))).toHaveLength(1);
    }
  });
});
