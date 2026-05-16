import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../run/helpers/getBlockTracking', () => ({ default: vi.fn() }));
vi.mock('../../run/helpers/setSlideFeedback', () => ({ default: vi.fn() }));
vi.mock('../../run/helpers/setSlideStatus', () => ({ default: vi.fn() }));
vi.mock('../../run/helpers/setSlideTrigger', () => ({ default: vi.fn() }));
vi.mock('../../ls/helpers/getString', () => ({ default: vi.fn() }));
vi.mock('../../blocks/helpers/getBlocksBySlideRef', () => ({ default: vi.fn() }));
vi.mock('../../blocks/helpers/getBlockDisplayType', () => ({ default: vi.fn() }));
vi.mock('../../generate/helpers/generate', () => ({ default: vi.fn() }));
vi.mock('~/core/app/helpers/buildLanguageSchema', () => ({
  default: (field, schema) => ({ [`en-US-${field}`]: schema })
}));

import TRIGGERS from '../triggers';
import '../showFeedbackFromPrompts.trigger.jsx';

describe('ShowFeedbackFromPrompts trigger registration', () => {
  it('registers under the SHOW_FEEDBACK_FROM_PROMPTS key', () => {
    expect(TRIGGERS.SHOW_FEEDBACK_FROM_PROMPTS).toBeDefined();
  });

  it('returns its action as SHOW_FEEDBACK_FROM_PROMPTS', () => {
    expect(TRIGGERS.SHOW_FEEDBACK_FROM_PROMPTS.getAction()).toBe('SHOW_FEEDBACK_FROM_PROMPTS');
  });

  it('returns the human-readable text', () => {
    expect(TRIGGERS.SHOW_FEEDBACK_FROM_PROMPTS.getText()).toBe('Provide feedback based on prompt responses');
  });

  it('returns a description', () => {
    const description = TRIGGERS.SHOW_FEEDBACK_FROM_PROMPTS.getDescription({});
    expect(description).toMatch(/feedback/i);
  });

  it('always stops navigation when triggered', () => {
    expect(TRIGGERS.SHOW_FEEDBACK_FROM_PROMPTS.getShouldStopNavigation()).toBe(true);
  });

  it('returns a schema with items and shouldGenerateFeedbackFromAI fields', () => {
    const schema = TRIGGERS.SHOW_FEEDBACK_FROM_PROMPTS.getSchema({});
    expect(schema.items.type).toBe('Array');
    expect(schema.shouldGenerateFeedbackFromAI.type).toBe('Toggle');
  });
});
