import each from 'lodash/each';
import getBlocksBySlideRef from '~/modules/blocks/helpers/getBlocksBySlideRef';
import getIsBlockValid from '~/modules/blocks/helpers/getIsBlockValid';

export default (slide) => {
  const errors = [];

  const blocks = getBlocksBySlideRef({ slideRef: slide.ref });
  if (!blocks?.length) {
    errors.push({ message: 'Slide has no blocks', action: 'OPEN_SLIDE_EDITOR' });
  }

  each(blocks, block => {
    const blockErrors = getIsBlockValid(block);
    errors.push(...blockErrors);
  });

  return errors;
};
