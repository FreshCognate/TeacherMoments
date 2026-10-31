import getCache from "~/core/cache/helpers/getCache";
import compact from 'lodash/compact';
import filter from 'lodash/filter';
import findLastIndex from 'lodash/findLastIndex';
import last from 'lodash/last';
import map from 'lodash/map';
import maxBy from 'lodash/maxBy';
import sortBy from 'lodash/sortBy';
import getParentStems from "~/modules/stems/helpers/getParentStems";

export default ({ stem }) => {
  const slides = getCache('slides').data;
  const stages = getCache('run').data?.stages || [];

  const parentStemSlides = compact(map(getParentStems({ stem }), (parentStem) => {
    return last(sortBy(filter(slides, { stemRef: parentStem.ref }), 'sortOrder'));
  }));

  return maxBy(parentStemSlides, (parentStemSlide) => findLastIndex(stages, { slideRef: parentStemSlide.ref }));
};
