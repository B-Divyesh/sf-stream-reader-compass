import { describe, expect, test } from 'vitest';
import { safeOrigin, transcriptToText } from '../shared/transcript';

describe('transcript serialization', () => {
  test('keeps repeated messages as separate records in exported text', () => {
    expect(transcriptToText([
      { id: 'one', speaker: 'Response', text: 'Same visible reply', links: [] },
      { id: 'two', speaker: 'Response', text: 'Same visible reply', links: [] }
    ])).toBe('1. Response\nSame visible reply\n\n2. Response\nSame visible reply');
  });

  test('accepts only web origins for site enablement', () => {
    expect(safeOrigin('https://chat.example.test/thread')).toBe('https://chat.example.test');
    expect(safeOrigin('file:///private/chat.html')).toBeNull();
  });
});
