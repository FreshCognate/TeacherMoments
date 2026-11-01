import getLastStemSlide from '~/modules/slides/helpers/getLastStemSlide';
import getActiveStem from './getActiveStem';
import getChildStems from './getChildStems';

export default ({ slideId }: { slideId: string }): boolean => {
  const activeStemChildren = getChildStems({ stem: getActiveStem() });
  if (activeStemChildren.length === 0) return false;
  return getLastStemSlide()?._id === slideId;
}
