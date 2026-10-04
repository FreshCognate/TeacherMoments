import React from 'react';
import CreateNavigationStaticSlide from './createNavigationStaticSlide';
import getTriggerBySlideRef from '~/modules/triggers/helpers/getTriggerBySlideRef';
import getStemsBySlideRef from '~/modules/stems/helpers/getStemsBySlideRef';
import filter from 'lodash/filter';
import CreateNavigationSlide from './createNavigationSlide';
import CreateDroppableContainer from '../containers/createDroppableContainer';
import { Slide } from '~/modules/slides/slides.types';
import { Block } from '~/modules/blocks/blocks.types';
import CreateStemsContainer from '../containers/createStemsContainer';
import { Stem } from '~/modules/stems/stems.types';

type Props = {
  scenarioId: string;
  stemSlides: Slide[];
  blocks: Block[];
  activeSlideId: string;
  activeStem: Stem;
  deletingId: string | null;
  isDuplicating: boolean;
  isInRootStem: boolean;
  onDuplicateSlideClicked: (slideId: string) => void;
  onDeleteSlideClicked: (slideId: string) => void;
  onCreateStemClicked: () => void;
};

const CreateNavigationStem = ({
  scenarioId,
  stemSlides,
  blocks,
  activeSlideId,
  activeStem,
  deletingId,
  isDuplicating,
  isInRootStem,
  onDuplicateSlideClicked,
  onDeleteSlideClicked,
  onCreateStemClicked
}: Props) => {
  return (
    <div className="p-2 overflow-y-auto no-scrollbar flex-grow">
      <CreateNavigationStaticSlide
        label="Consent"
        slideId="CONSENT"
        icon="consent"
        scenarioId={scenarioId}
        isSelected={activeSlideId === 'CONSENT'}
        isInRootStem={isInRootStem}
      />
      <CreateDroppableContainer
        id={`slides`}
        items={stemSlides}
        data={{
          type: 'SLIDES'
        }}
        renderItem={({
          item,
          index,
          items,
          draggingOptions
        }: {
          item: Slide,
          index: number,
          items: Slide[],
          draggingOptions: object
        }) => {

          const canDeleteSlides = items.length > 1;
          let isSelected = false;
          let isDeletingSlide = false;
          if (item._id === activeSlideId) isSelected = true;
          if (item._id === deletingId) isDeletingSlide = true;
          const slideBlocks = filter(blocks, { slideRef: item.ref });

          const slideTrigger = getTriggerBySlideRef({ slideRef: item.ref });
          const hasChildStems = getStemsBySlideRef({ slideRef: item.ref }).length > 0;
          return (
            <CreateNavigationSlide
              key={item._id}
              scenarioId={scenarioId}
              slide={item}
              slideBlocks={slideBlocks}
              slideTrigger={slideTrigger}
              draggingOptions={draggingOptions}
              isSelected={isSelected}
              isDeleting={isDeletingSlide}
              isDuplicating={isDuplicating}
              isInRootStem={isInRootStem}
              isNestedStem={false}
              canDeleteSlides={canDeleteSlides}
              hasChildStems={hasChildStems}
              onDuplicateSlideClicked={onDuplicateSlideClicked}
              onDeleteSlideClicked={onDeleteSlideClicked}
              onCreateStemClicked={onCreateStemClicked}
            />
          );

        }}
      />
      <CreateStemsContainer stemRef={activeStem.ref} />
      <CreateNavigationStaticSlide
        label="Summary"
        slideId="SUMMARY"
        icon="summary"
        scenarioId={scenarioId}
        isSelected={activeSlideId === 'SUMMARY'}
        isInRootStem={isInRootStem}
      />
    </div>
  );
};

export default CreateNavigationStem;