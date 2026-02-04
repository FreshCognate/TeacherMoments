import each from 'lodash/each';
import filter from 'lodash/filter';
import find from 'lodash/find';
import getBlockDisplayType from '~/modules/blocks/helpers/getBlockDisplayType';
import getBlocksBySlideRef from '~/modules/blocks/helpers/getBlocksBySlideRef';
import hasContent from '~/modules/ls/helpers/hasContent';

export default (trigger) => {
  const errors = [];

  switch (trigger.action) {
    case 'SHOW_FEEDBACK_FROM_PROMPTS': {
      const blocks = getBlocksBySlideRef({ slideRef: trigger.elementRef });
      const promptBlocks = filter(blocks, block => getBlockDisplayType(block) === 'PROMPT');

      if (!promptBlocks.length) {
        errors.push({ message: 'Slide has no prompt blocks to base conditions on', action: 'OPEN_TRIGGER_EDITOR' });
      }

      const itemsWithoutConditions = filter(trigger.items, item => !item.conditions?.length);
      if (itemsWithoutConditions.length > 1) {
        errors.push({ message: 'Only one feedback item can have no conditions', action: 'OPEN_TRIGGER_EDITOR' });
      }

      each(trigger.items, (item, index) => {
        if (!hasContent(item, 'body')) {
          errors.push({ message: `Feedback item ${index + 1} has no content`, action: 'OPEN_TRIGGER_EDITOR' });
        }

        each(item.conditions, condition => {
          each(condition.prompts, prompt => {
            if (!prompt.ref) {
              errors.push({ message: 'Condition has no prompt selected', action: 'OPEN_TRIGGER_EDITOR' });
              return;
            }

            const block = find(blocks, { ref: prompt.ref });
            if (!block) {
              errors.push({ message: 'Condition references a block that no longer exists', action: 'OPEN_TRIGGER_EDITOR' });
              return;
            }

            if (block.blockType === 'INPUT_PROMPT') {
              if (!prompt.text?.trim()) {
                errors.push({ message: 'Input prompt condition needs text', action: 'OPEN_TRIGGER_EDITOR' });
              }
            }

            if (block.blockType === 'MULTIPLE_CHOICE_PROMPT') {
              if (!prompt.options?.length) {
                errors.push({ message: 'Multiple choice condition needs options selected', action: 'OPEN_TRIGGER_EDITOR' });
              }
            }
          });
        });
      });
      break;
    }
  }

  return errors;
};
