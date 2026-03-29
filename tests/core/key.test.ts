import { describe, expect, it } from 'vitest';
import { matchesKey, normalizeKey, serializeKey } from '../../src/core/key';

describe('normalizeKey', () => {
  it('wraps a string to an array', () => {
    expect(normalizeKey('todos')).toEqual(['todos']);
  });

  it('passes an array through unchanged', () => {
    const key = ['todos', { status: 'active' }];
    expect(normalizeKey(key)).toEqual(key);
  });

  it('handles empty string', () => {
    expect(normalizeKey('')).toEqual(['']);
  });

  it('handles empty array', () => {
    expect(normalizeKey([])).toEqual([]);
  });
});

describe('serializeKey', () => {
  it('serializes a single-element array', () => {
    expect(serializeKey(['todos'])).toBe('["todos"]');
  });

  it('serializes an array with an object', () => {
    expect(serializeKey(['todos', { status: 'active' }])).toBe('["todos",{"status":"active"}]');
  });

  it('is deterministic — same input always same output', () => {
    const key = ['todos', { status: 'active', page: 1 }];
    expect(serializeKey(key)).toBe(serializeKey(key));
  });

  it('serializes nested arrays', () => {
    expect(serializeKey([['a', 'b']])).toBe('[["a","b"]]');
  });
});

describe('matchesKey', () => {
  it('returns true when partial is a prefix of full', () => {
    expect(matchesKey(['todos'], ['todos', { status: 'active' }])).toBe(true);
  });

  it('returns true for exact match', () => {
    expect(matchesKey(['todos'], ['todos'])).toBe(true);
  });

  it('returns false when partial is longer than full', () => {
    expect(matchesKey(['todos', { status: 'active' }], ['todos'])).toBe(false);
  });

  it('returns false when first segments differ', () => {
    expect(matchesKey(['posts'], ['todos'])).toBe(false);
  });

  it('returns false when object segments differ', () => {
    expect(matchesKey(['todos', { status: 'done' }], ['todos', { status: 'active' }])).toBe(false);
  });

  it('returns true for empty partial', () => {
    expect(matchesKey([], ['todos'])).toBe(true);
  });
});
