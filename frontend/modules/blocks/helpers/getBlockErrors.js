import hasContent from '~/modules/ls/helpers/hasContent';

const DEFAULT_LANGUAGE = 'en-US';

const hasAsset = (model, field) => {
  const value = model[`${DEFAULT_LANGUAGE}-${field}`];
  return !!value;
};

export default (block) => {
  const errors = [];
  const defaultError = { elementType: 'BLOCK', elementId: block._id };

  switch (block.blockType) {
    case 'TEXT':
      if (!hasContent(block, 'title') && !hasContent(block, 'body')) {
        errors.push({ ...defaultError, message: 'Block has no content' });
      }
      break;

    case 'MEDIA':
      if (block.mediaType === 'YOUTUBE') {
        if (!block.mediaSrc?.trim()) {
          errors.push({ ...defaultError, message: 'Missing YouTube URL' });
        }
      } else {
        if (!hasAsset(block, 'mediaAsset')) {
          errors.push({ ...defaultError, message: 'Missing media file' });
        }
      }
      break;

    case 'IMAGES':
      if (!block.items?.some(item => hasAsset(item, 'asset'))) {
        errors.push({ ...defaultError, message: 'No images added' });
      }
      break;

    case 'SUGGESTION':
      if (!hasContent(block, 'body')) {
        errors.push({ ...defaultError, message: 'Missing suggestion content' });
      }
      break;

    case 'RESPONSE':
      if (!block.responseRef) {
        errors.push({ ...defaultError, message: 'No response selected' });
      }
      break;

    case 'MULTIPLE_CHOICE_PROMPT':
      if (!block.options?.length) {
        errors.push({ ...defaultError, message: 'No options added' });
      } else {
        if (!block.options.some(opt => hasContent(opt, 'text'))) {
          errors.push({ ...defaultError, message: 'Options need text' });
        }
        if (!block.options.every(opt => opt.value?.trim())) {
          errors.push({ ...defaultError, message: 'Options need values' });
        }
        const values = block.options.map(opt => opt.value?.trim()).filter(Boolean);
        if (values.length !== new Set(values).size) {
          errors.push({ ...defaultError, message: 'Option values must be unique' });
        }
      }
      if (!hasContent(block, 'body')) {
        errors.push({ ...defaultError, message: 'Missing question text' });
      }
      break;

    case 'INPUT_PROMPT':
      if (!hasContent(block, 'body')) {
        errors.push({ ...defaultError, message: 'Missing prompt text' });
      }
      break;

    case 'ACTIONS_PROMPT':
      if (!block.actions?.length) {
        errors.push({ ...defaultError, message: 'No actions added' });
      } else if (!block.actions.some(act => hasContent(act, 'text'))) {
        errors.push({ ...defaultError, message: 'Actions need text' });
      }
      break;
  }

  return errors;
};
