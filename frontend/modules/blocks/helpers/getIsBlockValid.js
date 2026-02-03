const DEFAULT_LANGUAGE = 'en-US';

const hasContent = (model, field) => {
  const value = model[`${DEFAULT_LANGUAGE}-${field}`];
  if (!value) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) {
    return value.some(node => node.children?.some(child => child.text?.trim()));
  }
  return false;
};

const hasAsset = (model, field) => {
  const value = model[`${DEFAULT_LANGUAGE}-${field}`];
  return !!value;
};

export default (block) => {
  const errors = [];

  switch (block.blockType) {
    case 'TEXT':
      if (!hasContent(block, 'title') && !hasContent(block, 'body')) {
        errors.push({ message: 'Block has no content', action: 'OPEN_BLOCK_EDITOR' });
      }
      break;

    case 'MEDIA':
      if (block.mediaType === 'YOUTUBE') {
        if (!block.mediaSrc?.trim()) {
          errors.push({ message: 'Missing YouTube URL', action: 'OPEN_BLOCK_EDITOR' });
        }
      } else {
        if (!hasAsset(block, 'mediaAsset')) {
          errors.push({ message: 'Missing media file', action: 'OPEN_BLOCK_EDITOR' });
        }
      }
      break;

    case 'IMAGES':
      if (!block.items?.some(item => hasAsset(item, 'asset'))) {
        errors.push({ message: 'No images added', action: 'OPEN_BLOCK_EDITOR' });
      }
      break;

    case 'SUGGESTION':
      if (!hasContent(block, 'body')) {
        errors.push({ message: 'Missing suggestion content', action: 'OPEN_BLOCK_EDITOR' });
      }
      break;

    case 'RESPONSE':
      if (!block.responseRef) {
        errors.push({ message: 'No response selected', action: 'OPEN_BLOCK_EDITOR' });
      }
      break;

    case 'MULTIPLE_CHOICE_PROMPT':
      if (!block.options?.length) {
        errors.push({ message: 'No options added', action: 'OPEN_BLOCK_EDITOR' });
      } else {
        if (!block.options.some(opt => hasContent(opt, 'text'))) {
          errors.push({ message: 'Options need text', action: 'OPEN_BLOCK_EDITOR' });
        }
        if (!block.options.every(opt => opt.value?.trim())) {
          errors.push({ message: 'Options need values', action: 'OPEN_BLOCK_EDITOR' });
        }
        const values = block.options.map(opt => opt.value?.trim()).filter(Boolean);
        if (values.length !== new Set(values).size) {
          errors.push({ message: 'Option values must be unique', action: 'OPEN_BLOCK_EDITOR' });
        }
      }
      if (!hasContent(block, 'body')) {
        errors.push({ message: 'Missing question text', action: 'OPEN_BLOCK_EDITOR' });
      }
      break;

    case 'INPUT_PROMPT':
      if (!hasContent(block, 'body')) {
        errors.push({ message: 'Missing prompt text', action: 'OPEN_BLOCK_EDITOR' });
      }
      break;

    case 'ACTIONS_PROMPT':
      if (!block.actions?.length) {
        errors.push({ message: 'No actions added', action: 'OPEN_BLOCK_EDITOR' });
      } else if (!block.actions.some(act => hasContent(act, 'text'))) {
        errors.push({ message: 'Actions need text', action: 'OPEN_BLOCK_EDITOR' });
      }
      break;
  }

  return errors;
};
