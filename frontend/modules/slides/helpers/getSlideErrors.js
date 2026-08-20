import each from 'lodash/each';
import filter from 'lodash/filter';
import getBlocksBySlideRef from '~/modules/blocks/helpers/getBlocksBySlideRef';
import getBlockErrors from '~/modules/blocks/helpers/getBlockErrors';
import getStemsBySlideRef from '~/modules/stems/helpers/getStemsBySlideRef';
import getTriggersBySlideRef from '~/modules/triggers/helpers/getTriggersBySlideRef';

export default (slide) => {
  const errors = [];

  const blocks = getBlocksBySlideRef({ slideRef: slide.ref });
  if (!blocks?.length) {
    errors.push({ message: 'Slide has no blocks', elementType: 'SLIDE', elementId: slide._id });
  }

  const stems = getStemsBySlideRef({ slideRef: slide.ref });

  if (stems.length > 0) {
    const triggers = getTriggersBySlideRef({ slideRef: slide.ref });
    const branchingTriggers = filter(triggers, { action: 'BRANCH_TO_STEM_FROM_PROMPTS' });
    if (branchingTriggers.length === 0) {
      errors.push({ message: 'Slide with stems has no branching trigger', elementType: 'SLIDE_TRIGGER', elementId: slide._id });
    }
  }

  each(blocks, block => {
    const blockErrors = getBlockErrors(block);
    errors.push(...blockErrors);
  });

  return errors;
};
