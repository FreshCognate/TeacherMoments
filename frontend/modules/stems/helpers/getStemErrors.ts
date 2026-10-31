import each from 'lodash/each';
import every from 'lodash/every';
import find from 'lodash/find';
import some from 'lodash/some';
import tail from 'lodash/tail';
import getBlockByRef from '~/modules/blocks/helpers/getBlockByRef';
import getConditionlessStems from './getConditionlessStems';
import getStemByRef from './getStemByRef';
import { ConditionPrompt } from '~/modules/slides/slides.types';
import { Stem } from '../stems.types';

type StemError = {
  message: string,
  elementType: string,
  elementId: string
};

const hasValidAnswer = (prompt: ConditionPrompt) => {
  const block = getBlockByRef({ ref: prompt.ref });
  if (!block) return false;

  if (block.blockType === 'MULTIPLE_CHOICE_PROMPT') {
    if (!prompt.options?.length) return false;
    return every(prompt.options, option => find(block.options, { _id: option }));
  }

  if (block.blockType === 'INPUT_PROMPT') {
    return !!prompt.text?.trim();
  }

  return true;
};

export default (stem: Stem) => {
  const errors: StemError[] = [];
  const defaultError = { elementType: 'STEM', elementId: stem._id };

  const unreachableStems = tail(getConditionlessStems({ stem }));

  each(unreachableStems, (unreachableStem: Stem) => {
    errors.push({ ...defaultError, message: `Stem "${unreachableStem.name}" cannot be navigated to` });
  });

  each(stem.branchingOptions, branchingOption => {
    const hasInvalidPrompt = some(branchingOption.conditions, condition => {
      return !some(condition.prompts, hasValidAnswer);
    });

    if (hasInvalidPrompt) {
      const childStem = getStemByRef({ ref: branchingOption.stemRef });
      errors.push({ ...defaultError, message: `Stem "${childStem?.name}" has a condition without a valid answer selected` });
    }
  });

  return errors;
};
