import find from 'lodash/find.js';
import sortBy from 'lodash/sortBy.js';
import groupBy from 'lodash/groupBy.js';

export default function getSlideOrderByStemTraversal({ slides, stems }) {
  const orderByRef = new Map();
  const slidesByStemRef = groupBy(slides, (slide) => String(slide.stemRef));
  const stemsBySlideRef = groupBy(stems, (stem) => String(stem.slideRef));
  const visitedStems = new Set();
  let index = 0;

  const visitStem = (stem) => {
    const stemRef = String(stem.ref || stem._id);
    if (visitedStems.has(stemRef)) return;
    visitedStems.add(stemRef);

    const stemSlides = sortBy(slidesByStemRef[stemRef] || [], 'sortOrder');

    for (const slide of stemSlides) {
      const slideRef = String(slide.ref);
      if (orderByRef.has(slideRef)) continue;
      orderByRef.set(slideRef, index++);

      const childStems = sortBy(stemsBySlideRef[slideRef] || [], 'sortOrder');
      for (const childStem of childStems) {
        visitStem(childStem);
      }
    }
  };

  const rootStem = find(stems, { isRoot: true });
  if (rootStem) visitStem(rootStem);

  return orderByRef;
}
