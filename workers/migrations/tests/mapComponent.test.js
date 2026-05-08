import { describe, it, expect } from 'vitest';
import mapComponent from '../helpers/mapComponent.js';

describe('mapComponent', () => {
  it('maps Text via htmlToSlate and exposes images', () => {
    const result = mapComponent({ type: 'Text', html: '<p>Hello <img src="https://x/a.png"></p>' }, 0);

    expect(result.blockType).toBe('TEXT');
    expect(result.sortOrder).toBe(0);
    expect(result.fields['en-US-body']).toEqual([
      { type: 'paragraph', children: [{ text: 'Hello ' }] }
    ]);
    expect(result.images).toEqual(['https://x/a.png']);
  });

  it('maps MultiButtonResponse, including options[].display fallback to value', () => {
    const result = mapComponent({
      type: 'MultiButtonResponse',
      prompt: 'Pick one',
      required: true,
      buttons: [
        { display: 'Yes', value: 'yes' },
        { value: 'maybe' }
      ],
      responseId: 'r1',
      recallId: 'rc1'
    }, 2);

    expect(result.blockType).toBe('MULTIPLE_CHOICE_PROMPT');
    expect(result.sortOrder).toBe(2);
    expect(result.fields).toEqual({
      'en-US-body': [{ type: 'paragraph', children: [{ text: 'Pick one' }] }],
      isRequired: true,
      isMultiSelect: false,
      options: [
        { 'en-US-text': 'Yes', value: 'yes' },
        { 'en-US-text': 'maybe', value: 'maybe' }
      ]
    });
    expect(result.responseId).toBe('r1');
    expect(result.recallId).toBe('rc1');
  });

  it('maps AudioResponse and AudioPrompt as INPUT_PROMPT with AUDIO inputType', () => {
    const ar = mapComponent({ type: 'AudioResponse', prompt: 'Speak', responseId: 'r2', recallId: 'rc2' }, 0);
    expect(ar.blockType).toBe('INPUT_PROMPT');
    expect(ar.fields.inputType).toBe('AUDIO');
    expect(ar.responseId).toBe('r2');
    expect(ar.recallId).toBe('rc2');

    const ap = mapComponent({ type: 'AudioPrompt', prompt: 'Speak', responseId: 'r3', recallId: 'rc3' }, 0);
    expect(ap.blockType).toBe('INPUT_PROMPT');
    expect(ap.fields.inputType).toBe('AUDIO');
    expect(ap.responseId).toBe('r3');
    // AudioPrompt does NOT propagate recallId
    expect(ap.recallId).toBeUndefined();
  });

  it('maps AudioResponse falling back to header when no prompt is set', () => {
    const result = mapComponent({ type: 'AudioResponse', header: 'Headed' }, 0);
    expect(result.fields['en-US-body']).toEqual([
      { type: 'paragraph', children: [{ text: 'Headed' }] }
    ]);
  });

  it('maps TextResponse with placeholder and INPUT_PROMPT/TEXT', () => {
    const result = mapComponent({
      type: 'TextResponse',
      prompt: 'Tell me',
      placeholder: 'type here',
      required: false,
      responseId: 'r1'
    }, 0);

    expect(result.blockType).toBe('INPUT_PROMPT');
    expect(result.fields.inputType).toBe('TEXT');
    expect(result.fields['en-US-placeholder']).toBe('type here');
    expect(result.fields.isRequired).toBe(false);
  });

  it('maps ResponseRecall to RESPONSE with pendingRecallId', () => {
    const result = mapComponent({ type: 'ResponseRecall', recallId: 'rc1' }, 0);
    expect(result.blockType).toBe('RESPONSE');
    expect(result.pendingRecallId).toBe('rc1');
    expect(result.fields).toEqual({});
  });

  it('maps MultiPathResponse to ACTIONS_PROMPT and stores pendingSlideRefs', () => {
    const result = mapComponent({
      type: 'MultiPathResponse',
      prompt: 'Choose',
      paths: [
        { display: 'Go A', value: 'slide-a' },
        { display: 'Go B', value: 'slide-b' }
      ],
      responseId: 'r4'
    }, 0);

    expect(result.blockType).toBe('ACTIONS_PROMPT');
    expect(result.fields.actions).toEqual([
      { 'en-US-text': 'Go A', actionType: 'COMPLETE_SLIDE', actionValue: 'slide-a' },
      { 'en-US-text': 'Go B', actionType: 'COMPLETE_SLIDE', actionValue: 'slide-b' }
    ]);
    expect(result.pendingSlideRefs).toEqual(['slide-a', 'slide-b']);
    expect(result.responseId).toBe('r4');
  });

  it('maps Suggestion to SUGGESTION with suggestionType: INFO', () => {
    const result = mapComponent({ type: 'Suggestion', html: '<p>Tip</p>' }, 0);
    expect(result.blockType).toBe('SUGGESTION');
    expect(result.fields.suggestionType).toBe('INFO');
  });

  it('maps ConditionalContent using component.component.html when present, otherwise component.html', () => {
    const nested = mapComponent({ type: 'ConditionalContent', component: { html: '<p>Inner</p>' } }, 0);
    expect(nested.fields['en-US-body']).toEqual([
      { type: 'paragraph', children: [{ text: 'Inner' }] }
    ]);

    const flat = mapComponent({ type: 'ConditionalContent', html: '<p>Flat</p>' }, 0);
    expect(flat.fields['en-US-body']).toEqual([
      { type: 'paragraph', children: [{ text: 'Flat' }] }
    ]);
  });

  it('maps ChatPrompt / AnnotationPrompt / ConversationPrompt to TEXT with sensible defaults', () => {
    const chat = mapComponent({ type: 'ChatPrompt' }, 0);
    expect(chat.blockType).toBe('TEXT');
    expect(chat.fields['en-US-body']).toEqual([
      { type: 'paragraph', children: [{ text: 'Chat prompt (migrated)' }] }
    ]);

    const annotation = mapComponent({ type: 'AnnotationPrompt', question: 'What?' }, 0);
    expect(annotation.fields['en-US-body']).toEqual([
      { type: 'paragraph', children: [{ text: 'What?' }] }
    ]);
  });

  it('falls back to TEXT with an informative body for unknown types', () => {
    const result = mapComponent({ type: 'Mystery' }, 0);
    expect(result.blockType).toBe('TEXT');
    expect(result.fields['en-US-body']).toEqual([
      { type: 'paragraph', children: [{ text: 'Unknown component type: Mystery' }] }
    ]);
  });
});
