import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { GoogleGenAIMock } = vi.hoisted(() => ({ GoogleGenAIMock: vi.fn() }));
vi.mock('@google/genai', () => ({
  GoogleGenAI: function (...args) { return GoogleGenAIMock(...args); }
}));

import getGemini from '../getGemini.js';

describe('getGemini', () => {
  let originalKey;

  beforeEach(() => {
    vi.clearAllMocks();
    GoogleGenAIMock.mockImplementation(function () { return this; });
    originalKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = 'test-key';
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  });

  it('instantiates GoogleGenAI with the GEMINI_API_KEY env var', () => {
    getGemini();

    expect(GoogleGenAIMock).toHaveBeenCalledTimes(1);
    expect(GoogleGenAIMock).toHaveBeenCalledWith({ apiKey: 'test-key' });
  });
});
