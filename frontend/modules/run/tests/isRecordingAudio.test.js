import { describe, it, expect, beforeEach } from 'vitest';
import setIsRecordingAudio from '../helpers/setIsRecordingAudio.js';
import getIsRecordingAudio from '../helpers/getIsRecordingAudio.js';
import AUDIO from '../audio.js';

describe('isRecordingAudio', () => {
  beforeEach(() => {
    AUDIO.isRecordingAudio = false;
  });

  it('defaults to false', () => {
    expect(getIsRecordingAudio()).toBe(false);
  });

  it('reads back the value that was set', () => {
    setIsRecordingAudio(true);
    expect(getIsRecordingAudio()).toBe(true);

    setIsRecordingAudio(false);
    expect(getIsRecordingAudio()).toBe(false);
  });

  it('coerces non-boolean values to a boolean', () => {
    setIsRecordingAudio(undefined);
    expect(getIsRecordingAudio()).toBe(false);

    setIsRecordingAudio('recording');
    expect(getIsRecordingAudio()).toBe(true);
  });

  it('shares state across every consumer of the module', () => {
    setIsRecordingAudio(true);
    expect(AUDIO.isRecordingAudio).toBe(true);
  });
});
