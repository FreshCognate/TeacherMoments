import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import filter from 'lodash/filter';
import last from 'lodash/last';
import getParentStems from "./getParentStems";

export default () => {

  const editor = getCache('editor');
  const { activeStemRef, stemPath } = editor.data;

  const stems = getCache('stems');
  const activeStem = find(stems.data, { ref: activeStemRef });
  if (activeStem) {
    const parentStems = getParentStems({ stem: activeStem });
    const parentStem = find(parentStems, (stem) => stem.ref === last(stemPath)) || parentStems[0];
    if (parentStem) {
      const slides = getCache('slides');
      const stemSlides = filter(slides.data, { stemRef: parentStem.ref });
      const lastSlide = stemSlides[stemSlides.length - 1];
      if (lastSlide) {
        return stemSlides[stemSlides.length - 1]._id;
      }
    }
  }

}
