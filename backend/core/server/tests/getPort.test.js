import { describe, it, expect, vi, beforeEach } from 'vitest';

const { argsMock } = vi.hoisted(() => {
  const argsMock = {
    option: vi.fn(),
    parse: vi.fn()
  };
  argsMock.option.mockReturnValue(argsMock);
  return { argsMock };
});

vi.mock('args', () => ({ default: argsMock }));

import getPort from '../helpers/getPort.js';

describe('getPort', () => {
  beforeEach(() => {
    argsMock.parse.mockReset();
  });

  it('returns the default port (4000) when no --port flag is provided', () => {
    argsMock.parse.mockReturnValue({});
    expect(getPort()).toBe(4000);
  });

  it('returns the parsed port when a --port flag is provided', () => {
    argsMock.parse.mockReturnValue({ port: 5500 });
    expect(getPort()).toBe(5500);
  });

  it('parses process.argv', () => {
    argsMock.parse.mockReturnValue({});
    getPort();
    expect(argsMock.parse).toHaveBeenCalledWith(process.argv);
  });
});
