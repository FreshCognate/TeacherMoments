import getCache from '~/core/cache/helpers/getCache';
import registerCondition from '~/core/forms/helpers/registerCondition';

const isRootSlide = function ({
  condition,
}) {

  const slide = getCache('slide');

  if (slide.data.isRoot) {
    return {
      hasCondition: true
    };
  }

  return {
    hasCondition: false,
    condition: null,
  };

};

registerCondition('isRootSlide', isRootSlide);