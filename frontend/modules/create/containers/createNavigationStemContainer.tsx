import React, { Component } from 'react';
import CreateNavigationStem from '../components/createNavigationStem';
import { Slide } from '~/modules/slides/slides.types';
import { Block } from '~/modules/blocks/blocks.types';
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
};

class CreateNavigationStemContainer extends Component<Props> {
  render() {
    const {
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
    } = this.props;
    return (
      <CreateNavigationStem
        scenarioId={scenarioId}
        stemSlides={stemSlides}
        blocks={blocks}
        activeSlideId={activeSlideId}
        activeStem={activeStem}
        deletingId={deletingId}
        isDuplicating={isDuplicating}
        isInRootStem={isInRootStem}
        onDuplicateSlideClicked={onDuplicateSlideClicked}
        onDeleteSlideClicked={onDeleteSlideClicked}
      />
    );
  }
};

export default CreateNavigationStemContainer;