import getStemsByStemRef from "~/modules/stems/helpers/getStemsByStemRef";
import findIndex from 'lodash/findIndex';
import getCache from "~/core/cache/helpers/getCache";
import getCurrentStemSlides from "~/modules/stems/helpers/getCurrentStemSlides";

export default () => {
  let hasChildStems = false;
  let isLastSlideInStem = false;
  const activeSlide = getCache('slides').get('active');

  if (activeSlide) {
    const childStems = getStemsByStemRef({ stemRef: activeSlide.stemRef })
    hasChildStems = childStems.length > 0;
    const currentStemSlides = getCurrentStemSlides();
    const currentSlideStemIndex = findIndex(currentStemSlides, { _id: activeSlide._id })
    if (currentStemSlides.length - 1 === currentSlideStemIndex) {
      isLastSlideInStem = true;
    }
  }


  return { hasChildStems, isLastSlideInStem };
}