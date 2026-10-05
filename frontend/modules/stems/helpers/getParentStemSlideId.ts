import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import filter from 'lodash/filter';

export default () => {

  const editor = getCache('editor');
  const { activeStemRef } = editor.data;

  const stems = getCache('stems');
  const activeStem = find(stems.data, { ref: activeStemRef });
  if (activeStem) {
    const parentStem = find(stems.data, { ref: activeStem.stemRef });
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