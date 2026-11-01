import getActiveStem from './getActiveStem';
import getChildStems from './getChildStems';
import getCurrentStemSlides from './getCurrentStemSlides';

export default ({ sourceIndex, destinationIndex }: { sourceIndex: number, destinationIndex: number }): boolean => {
  if (sourceIndex === destinationIndex) return false;
  const lastSlideIndex = getCurrentStemSlides().length - 1;
  const isMovingLastSlide = sourceIndex === lastSlideIndex;
  const isDroppingAfterLastSlide = destinationIndex > lastSlideIndex;
  if (!isMovingLastSlide && !isDroppingAfterLastSlide) return false;
  return getChildStems({ stem: getActiveStem() }).length > 0;
}
