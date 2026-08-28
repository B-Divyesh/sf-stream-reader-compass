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
    expect(site).not.toContain('Edition 404');
  });

  test('keeps the catalog description verb-first and within 120 characters', () => {
    const description = readFileSync('.factory/catalog-description.txt', 'utf8').trim();
    expect(description.length).toBeLessThanOrEqual(120);
    expect(description).toMatch(/^Read\b/);
  });
});
