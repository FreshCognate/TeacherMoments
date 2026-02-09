import each from 'lodash/each';
import filter from 'lodash/filter';
import find from 'lodash/find';
import getBlockDisplayType from '~/modules/blocks/helpers/getBlockDisplayType';
import getBlocksBySlideRef from '~/modules/blocks/helpers/getBlocksBySlideRef';
import hasContent from '~/modules/ls/helpers/hasContent';

export default (trigger) => {
  const errors = [];
  const defaultError = { elementType: 'TRIGGER', elementId: trigger._id };

  switch (trigger.action) {
    case 'SHOW_FEEDBACK_FROM_PROMPTS': {
      const blocks = getBlocksBySlideRef({ slideRef: trigger.elementRef });
      const promptBlocks = filter(blocks, block => getBlockDisplayType(block) === 'PROMPT');

      if (!promptBlocks.length) {
        errors.push({ ...defaultError, message: 'Slide has no prompt blocks to base conditions on' });
      }

      const itemsWithoutConditions = filter(trigger.items, item => !item.conditions?.length);
      if (itemsWithoutConditions.length > 1) {
        errors.push({ ...defaultError, message: 'Only one feedback item can have no conditions' });
      }

      each(trigger.items, (item, index) => {
        if (!hasContent(item, 'body')) {
          errors.push({ ...defaultError, message: `Feedback item ${index + 1} has no content` });
        }

        each(item.conditions, condition => {
          each(condition.prompts, prompt => {
            if (!prompt.ref) {
              errors.push({ ...defaultError, message: 'Condition has no prompt selected' });
              return;
            }

            const block = find(blocks, { ref: prompt.ref });
            if (!block) {
              errors.push({ ...defaultError, message: 'Condition references a block that no longer exists' });
              return;
            }

            if (block.blockType === 'INPUT_PROMPT') {
              if (!prompt.text?.trim()) {
                errors.push({ ...defaultError, message: 'Input prompt condition needs text' });
              }
            }

            if (block.blockType === 'MULTIPLE_CHOICE_PROMPT') {
              if (!prompt.options?.length) {
                errors.push({ ...defaultError, message: 'Multiple choice condition needs options selected' });
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
