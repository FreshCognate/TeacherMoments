import { describe, it, expect } from 'vitest';
import getBlockErrors from './getBlockErrors.js';

const titleField = (text) => ({ 'en-US-title': text });
const bodyField = (text) => ({ 'en-US-body': text });
const assetField = (asset) => ({ 'en-US-mediaAsset': asset });
const itemAssetField = (asset) => ({ 'en-US-asset': asset });
const optionTextField = (text) => ({ 'en-US-text': text });
const actionTextField = (text) => ({ 'en-US-text': text });

describe('getBlockErrors', () => {
  describe('TEXT', () => {
    it('reports an error when both title and body are missing', () => {
      const errors = getBlockErrors({ _id: 'b1', blockType: 'TEXT' });
      expect(errors).toEqual([
        { elementType: 'BLOCK', elementId: 'b1', message: 'Block has no content' }
      ]);
    });

    it('passes when at least one of title/body has content', () => {
      expect(getBlockErrors({ _id: 'b1', blockType: 'TEXT', ...titleField('hi') })).toEqual([]);
      expect(getBlockErrors({ _id: 'b1', blockType: 'TEXT', ...bodyField('hi') })).toEqual([]);
    });
  });

  describe('MEDIA', () => {
    it('requires a YouTube URL when mediaType is YOUTUBE', () => {
      expect(
        getBlockErrors({ _id: 'b1', blockType: 'MEDIA', mediaType: 'YOUTUBE' })[0].message
      ).toBe('Missing YouTube URL');

      expect(
        getBlockErrors({ _id: 'b1', blockType: 'MEDIA', mediaType: 'YOUTUBE', mediaSrc: 'https://x' })
      ).toEqual([]);
    });

    it('requires an asset when mediaType is not YOUTUBE', () => {
      expect(
        getBlockErrors({ _id: 'b1', blockType: 'MEDIA', mediaType: 'AUDIO' })[0].message
      ).toBe('Missing media file');

      expect(
        getBlockErrors({ _id: 'b1', blockType: 'MEDIA', mediaType: 'AUDIO', ...assetField('asset-id') })
      ).toEqual([]);
    });
  });

  describe('IMAGES', () => {
    it('reports an error when no items have assets', () => {
      expect(
        getBlockErrors({ _id: 'b1', blockType: 'IMAGES', items: [] })[0].message
      ).toBe('No images added');
    });

    it('passes when at least one item has an asset', () => {
      expect(
        getBlockErrors({
          _id: 'b1',
          blockType: 'IMAGES',
          items: [itemAssetField('asset-id')]
        })
      ).toEqual([]);
    });
  });

  describe('SUGGESTION', () => {
    it('requires a body', () => {
      expect(
        getBlockErrors({ _id: 'b1', blockType: 'SUGGESTION' })[0].message
      ).toBe('Missing suggestion content');

      expect(
        getBlockErrors({ _id: 'b1', blockType: 'SUGGESTION', ...bodyField('hi') })
      ).toEqual([]);
    });
  });

  describe('RESPONSE', () => {
    it('requires responseRef', () => {
      expect(
        getBlockErrors({ _id: 'b1', blockType: 'RESPONSE' })[0].message
      ).toBe('No response selected');

      expect(
        getBlockErrors({ _id: 'b1', blockType: 'RESPONSE', responseRef: 'r1' })
      ).toEqual([]);
    });
  });

  describe('MULTIPLE_CHOICE_PROMPT', () => {
    it('reports "No options added" when options is empty', () => {
      const messages = getBlockErrors({
        _id: 'b1',
        blockType: 'MULTIPLE_CHOICE_PROMPT',
        ...bodyField('hi')
      }).map((e) => e.message);
      expect(messages).toContain('No options added');
    });

    it('reports when options are missing text or values', () => {
      const messages = getBlockErrors({
        _id: 'b1',
        blockType: 'MULTIPLE_CHOICE_PROMPT',
        ...bodyField('hi'),
        options: [{ value: 'a' }, { value: 'b' }]
      }).map((e) => e.message);
      expect(messages).toContain('Options need text');
    });

    it('reports duplicate option values', () => {
      const messages = getBlockErrors({
        _id: 'b1',
        blockType: 'MULTIPLE_CHOICE_PROMPT',
        ...bodyField('hi'),
        options: [
          { value: 'a', ...optionTextField('A') },
          { value: 'a', ...optionTextField('Another A') }
        ]
      }).map((e) => e.message);
      expect(messages).toContain('Option values must be unique');
    });

    it('reports missing question text when body is empty', () => {
      const messages = getBlockErrors({
        _id: 'b1',
        blockType: 'MULTIPLE_CHOICE_PROMPT',
        options: [{ value: 'a', ...optionTextField('A') }]
      }).map((e) => e.message);
      expect(messages).toContain('Missing question text');
    });

    it('passes when all rules are satisfied', () => {
      expect(
        getBlockErrors({
          _id: 'b1',
          blockType: 'MULTIPLE_CHOICE_PROMPT',
          ...bodyField('Pick one'),
          options: [
            { value: 'a', ...optionTextField('A') },
            { value: 'b', ...optionTextField('B') }
          ]
        })
      ).toEqual([]);
    });
  });

  describe('INPUT_PROMPT', () => {
    it('requires body content', () => {
      expect(
        getBlockErrors({ _id: 'b1', blockType: 'INPUT_PROMPT' })[0].message
      ).toBe('Missing prompt text');

      expect(
        getBlockErrors({ _id: 'b1', blockType: 'INPUT_PROMPT', ...bodyField('hi') })
      ).toEqual([]);
    });
  });

  describe('ACTIONS_PROMPT', () => {
    it('reports "No actions added" when actions is empty', () => {
      expect(
        getBlockErrors({ _id: 'b1', blockType: 'ACTIONS_PROMPT' })[0].message
      ).toBe('No actions added');
    });

    it('reports when actions are missing text', () => {
      expect(
        getBlockErrors({
          _id: 'b1',
          blockType: 'ACTIONS_PROMPT',
          actions: [{}, {}]
        })[0].message
      ).toBe('Actions need text');
    });

    it('passes when at least one action has text', () => {
      expect(
        getBlockErrors({
          _id: 'b1',
          blockType: 'ACTIONS_PROMPT',
          actions: [actionTextField('Continue')]
        })
      ).toEqual([]);
    });
  });
});
