import cloneDeep from 'lodash/cloneDeep';
import each from 'lodash/each';
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import axios from 'axios';
import getCache from '~/core/cache/helpers/getCache';

export default ({ active, over }) => {
  if (!active || !over) return;

  const sourceIndex = active.data.current.sortOrder;
  let destinationIndex = over.data.current.sortOrder;

  const draggableId = active.id;

  if (sourceIndex === destinationIndex) return;

  const slides = getCache('slides');

  const allSlides = cloneDeep(slides.data);

  const draggedSlide = find(allSlides, { _id: draggableId });
  if (!draggedSlide) return;

  const stemRef = draggedSlide.stemRef;
  const stemSlides = filter(allSlides, (slide) => slide.stemRef === stemRef);

  if (destinationIndex > sourceIndex) {
    destinationIndex = destinationIndex - 1;
  }

  const [removed] = stemSlides.splice(sourceIndex, 1);
  stemSlides.splice(destinationIndex, 0, removed);

  each(stemSlides, (item, index) => {
    item.sortOrder = index;
  });

  let stemPointer = 0;
  const reorderedSlides = map(allSlides, (slide) => {
    if (slide.stemRef === stemRef) {
      const nextStemSlide = stemSlides[stemPointer];
      stemPointer = stemPointer + 1;
      return nextStemSlide;
    }
    return slide;
  });

  slides.set(reorderedSlides, { setType: 'replace' });

  axios.put(`/api/slides/${draggableId}`, {
    sourceIndex,
    destinationIndex
  });
};
