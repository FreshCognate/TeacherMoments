import getBlocksBySlideRef from '~/modules/blocks/helpers/getBlocksBySlideRef';

export default (slide) => {
  const errors = [];

  const blocks = getBlocksBySlideRef({ slideRef: slide.ref });
  if (!blocks?.length) {
    errors.push({ message: 'Slide has no blocks', action: 'OPEN_SLIDE_EDITOR' });
  }

  return errors;
};
