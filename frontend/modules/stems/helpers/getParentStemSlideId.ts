import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import filter from 'lodash/filter';
import nth from 'lodash/nth';
import getParentStems from "./getParentStems";
import getActiveStemRef from "./getActiveStemRef";

export default () => {

  const editor = getCache('editor');
  const { stemPath } = editor.data;

  const stems = getCache('stems');
  const activeStem = find(stems.data, { ref: getActiveStemRef() });
  if (activeStem) {
    const parentStems = getParentStems({ stem: activeStem });
    const parentStem = find(parentStems, (stem) => stem.ref === nth(stemPath, -2)) || parentStems[0];
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
