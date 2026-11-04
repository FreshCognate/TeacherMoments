import each from 'lodash/each';
import { Stem } from '~/modules/stems/stems.types';
import { Slide } from '~/modules/slides/slides.types';
import { OverviewSlide } from '../create.types';

type Options = {
  stem: Stem;
  slides: Slide[];
  scenarioId: string;
  activeSlideId: string | null;
  activeStemRef: string | null;
  hasChildStems: boolean;
};

export default ({
  stem,
  slides,
  scenarioId,
  activeSlideId,
  activeStemRef,
  hasChildStems
}: Options): OverviewSlide[] => {
  const stemSlides: OverviewSlide[] = [];

  each(slides, (slide) => {
    if (slide.stemRef !== stem.ref) return;
    stemSlides.push({
      ...slide,
      to: `/scenarios/${scenarioId}/create?slide=${slide._id}`,
      isSelected: slide._id === activeSlideId
    });
  });

  if (stem.isRoot) {
    stemSlides.unshift({
      _id: 'CONSENT_SLIDE',
      stemRef: stem.ref,
      slideType: 'CONSENT',
      sortOrder: -1,
      to: `/scenarios/${scenarioId}/create?slide=CONSENT`,
      isSelected: activeSlideId === 'CONSENT'
    });
  }

  if (!hasChildStems) {
    stemSlides.push({
      _id: 'SUMMARY_SLIDE',
      stemRef: stem.ref,
      slideType: 'SUMMARY',
      sortOrder: stemSlides.length,
      to: `/scenarios/${scenarioId}/create?slide=SUMMARY`,
      isSelected: activeSlideId === 'SUMMARY' && stem.ref === activeStemRef
    });
  }

  return stemSlides;
};
