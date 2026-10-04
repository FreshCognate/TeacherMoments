import React, { Component } from 'react';
import CreateNavigationStem from '../components/createNavigationStem';
import { Slide } from '~/modules/slides/slides.types';
import { Block } from '~/modules/blocks/blocks.types';
import { Stem } from '~/modules/stems/stems.types';

type Props = {
  scenarioId: string;
  rootSlides: Slide[];
  blocks: Block[];
  activeSlideId: string;
  activeStem: Stem;
  activeSlideStems: Stem[];
  deletingId: string | null;
  isDuplicating: boolean;
  isInRootStem: boolean;
  onDuplicateSlideClicked: (slideId: string) => void;
  onDeleteSlideClicked: (slideId: string) => void;
  onCreateStemClicked: () => void;
};

class CreateNavigationStemContainer extends Component<Props> {
  render() {
    const {
      scenarioId,
      rootSlides,
      blocks,
      activeSlideId,
      deletingId,
      isDuplicating,
      isInRootStem,
      onDuplicateSlideClicked,
      onDeleteSlideClicked,
      onCreateStemClicked
    } = this.props;
    return (
      <CreateNavigationStem
        scenarioId={scenarioId}
        rootSlides={rootSlides}
        blocks={blocks}
        activeSlideId={activeSlideId}
        deletingId={deletingId}
        isDuplicating={isDuplicating}
        isInRootStem={isInRootStem}
        onDuplicateSlideClicked={onDuplicateSlideClicked}
        onDeleteSlideClicked={onDeleteSlideClicked}
        onCreateStemClicked={onCreateStemClicked}
      />
    );
  }
};

export default CreateNavigationStemContainer;