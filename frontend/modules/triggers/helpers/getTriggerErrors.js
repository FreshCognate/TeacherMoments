import each from 'lodash/each';
import filter from 'lodash/filter';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import getBlockDisplayType from '~/modules/blocks/helpers/getBlockDisplayType';
import getBlocksBySlideRef from '~/modules/blocks/helpers/getBlocksBySlideRef';
import getStemsBySlideRef from '~/modules/stems/helpers/getStemsBySlideRef';
import getConditionlessStems from './getConditionlessStems';
import hasContent from '~/modules/ls/helpers/hasContent';

const getConditionKey = (condition) => {
  const prompts = map(condition.prompts, prompt => [
    prompt.ref,
    sortBy(prompt.options).join('|'),
    (prompt.text || '').trim().toLowerCase()
  ].join('~'));

  return sortBy(prompts).join('&&');
};

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
    case 'BRANCH_TO_STEM_FROM_PROMPTS': {
      const blocks = getBlocksBySlideRef({ slideRef: trigger.elementRef });
      const promptBlocks = filter(blocks, block => getBlockDisplayType(block) === 'PROMPT');
      const slideStems = getStemsBySlideRef({ slideRef: trigger.elementRef });

      const getItemLabel = (item, index) => {
        const stem = item.elementRef && find(slideStems, { ref: item.elementRef });
        return stem?.name ? `Stem "${stem.name}"` : `Branch ${index + 1}`;
      };

      if (!promptBlocks.length) {
        errors.push({ ...defaultError, message: 'Slide has no prompt blocks to base conditions on' });
      }

      const conditionlessStems = getConditionlessStems({ trigger });

      if (conditionlessStems.length > 1) {
        errors.push({ ...defaultError, message: 'Only one stem can have no conditions' });
      }

      if (conditionlessStems.length === 0) {
        if (!trigger.defaultStemRef) {
          errors.push({ ...defaultError, message: 'No default stem set' });
        } else if (!find(slideStems, { ref: trigger.defaultStemRef })) {
          errors.push({ ...defaultError, message: 'Default stem no longer exists' });
        }
      }

      const conditionKeys = [];

      each(trigger.items, (item, index) => {
        const itemLabel = getItemLabel(item, index);

        if (!item.elementRef) {
          errors.push({ ...defaultError, message: `${itemLabel} has no stem to branch to` });
        } else if (!find(slideStems, { ref: item.elementRef })) {
          errors.push({ ...defaultError, message: `${itemLabel} branches to a stem that no longer exists` });
        }

        each(item.conditions, condition => {
          if (!condition.prompts?.length) {
            errors.push({ ...defaultError, message: `${itemLabel} has a condition with no prompts set` });
            return;
          }

          conditionKeys.push({ key: getConditionKey(condition), index });

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

      each(groupBy(conditionKeys, 'key'), (matchedConditions) => {
        const duplicateIndexes = uniq(map(matchedConditions, 'index'));
        if (duplicateIndexes.length < 2) return;

        const labels = map(duplicateIndexes, index => getItemLabel(trigger.items[index], index));
        errors.push({ ...defaultError, message: `More than one stem uses the same condition: ${labels.join(', ')}` });
      });
      break;
    }
  }

  return errors;
};
