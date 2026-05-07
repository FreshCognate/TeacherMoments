import { describe, it, expect } from 'vitest';
import rowsToCsvBuffer from '../helpers/rowsToCsvBuffer.js';

describe('rowsToCsvBuffer', () => {
  it('returns a Buffer of CSV text with the first row used as headers', async () => {
    const buffer = await rowsToCsvBuffer([
      ['name', 'age'],
      ['sam', '30'],
      ['alex', '25']
    ]);

    expect(Buffer.isBuffer(buffer)).toBe(true);
    const csv = buffer.toString();
    expect(csv).toContain('name,age');
    expect(csv).toContain('sam,30');
    expect(csv).toContain('alex,25');
  });

  it('quotes fields containing commas', async () => {
    const buffer = await rowsToCsvBuffer([
      ['name', 'tags'],
      ['sam', 'a, b, c']
    ]);

    const csv = buffer.toString();
    expect(csv).toContain('"a, b, c"');
  });
});
