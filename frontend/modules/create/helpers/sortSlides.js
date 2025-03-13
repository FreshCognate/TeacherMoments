import cloneDeep from 'lodash/cloneDeep';
import each from 'lodash/each';
import axios from 'axios';
import getCache from '~/core/cache/helpers/getCache';

export default ({ active, over }) => {
  if (!active || !over) return;

  const sourceIndex = active.data.current.sortOrder;
  let destinationIndex = over.data.current.sortOrder;

  const draggableId = active.id;

  if (sourceIndex === destinationIndex) return;

  const slides = getCache('slides');

  const sourceArray = cloneDeep(slides.data);


  if (destinationIndex > sourceIndex) {
    destinationIndex = destinationIndex - 1;
  }

  const [removed] = sourceArray.splice(sourceIndex, 1);
  sourceArray.splice(destinationIndex, 0, removed);

  each(sourceArray, (item, index) => {
    item.sortOrder = index;
  });

  slides.set(sourceArray, { setType: 'replace' });

  axios.put(`/api/slides/${draggableId}`, {
    sourceIndex,
    destinationIndex
  });
};