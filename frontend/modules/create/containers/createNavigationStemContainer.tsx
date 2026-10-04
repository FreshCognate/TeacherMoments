import React, { Component } from 'react';
import CreateNavigationStem from '../components/createNavigationStem';
import { Slide } from '~/modules/slides/slides.types';
import { Block } from '~/modules/blocks/blocks.types';
import getScenarioDetails from '~/modules/run/helpers/getScenarioDetails';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import getCurrentStemSlides from '~/modules/stems/helpers/getCurrentStemSlides';
import getActiveStem from '~/modules/stems/helpers/getActiveStem';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import setEditingMode from '../helpers/setEditingMode';
import axios from 'axios';
import getSelectedSlideSortOrder from '~/modules/stems/helpers/getSelectedSlideSortOrder';
import find from 'lodash/find';

type Props = {
  scenarioId: string;
  isDuplicating: boolean;
  isInRootStem: boolean;
  slides: {
    data: Slide[];
    fetch: () => Promise<unknown>;
  };
  blocks: {
    data: Block[];
    fetch: () => Promise<unknown>;
  };
  router: any;
};

type State = {
  deletingId: string | null;
  isDuplicating: boolean;
};

class CreateNavigationStemContainer extends Component<Props, State> {

  state: State = {
    deletingId: null,
    isDuplicating: false
  };

  onDeleteSlideClicked = (slideId: string) => {
    const selectedSlideSortOrder = getSelectedSlideSortOrder();
    this.setState({ deletingId: slideId });
    axios.delete(`/api/slides/${slideId}`).then(() => {

      this.props.slides.fetch().then(() => {

        this.setState({ deletingId: null }, () => {
          const scenarioId = this.props.scenarioId;
          const slideWithSameSortOrderAsDeleted = find(this.props.slides.data, { sortOrder: selectedSlideSortOrder });

          if (slideWithSameSortOrderAsDeleted) {
            this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${slideWithSameSortOrderAsDeleted._id}`, {
              replace: true
            })
          } else {
            const slideBeforeDeletedSlide = find(this.props.slides.data, { sortOrder: selectedSlideSortOrder - 1 });
            if (slideBeforeDeletedSlide) {
              this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${slideBeforeDeletedSlide._id}`, {
                replace: true
              })
            }
          }

        });
      });

    }).catch((error) => {
      this.props.slides.fetch();
      this.setState({ deletingId: null });
      handleRequestError(error);
    })
  }

  onDuplicateSlideClicked = (slideId: string) => {
    this.setState({ isDuplicating: true });
    const scenarioId = this.props.scenarioId;
    axios.post(`/api/slides`, {
      scenarioId,
      slideId,
    }).then((response) => {
      const slideId = response.data.slide._id;
      this.props.blocks.fetch();
      this.props.slides.fetch().then(() => {
        setEditingMode();
        this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${slideId}`, {
          replace: true
        })
        this.setState({ isDuplicating: false });
      });
    }).catch((error) => {
      this.props.slides.fetch();
      this.setState({ isDuplicating: false });
      handleRequestError(error);
    })
  }

  render() {
    const {
      scenarioId,
      isDuplicating,
      isInRootStem,
    } = this.props;

    const stemSlides = getCurrentStemSlides();
    const { activeSlideId } = getScenarioDetails();
    const activeStem = getActiveStem();
    return (
      <CreateNavigationStem
        scenarioId={scenarioId}
        stemSlides={stemSlides}
        blocks={this.props.blocks.data}
        activeSlideId={activeSlideId}
        activeStem={activeStem}
        deletingId={this.state.deletingId}
        isDuplicating={isDuplicating}
        isInRootStem={isInRootStem}
        onDuplicateSlideClicked={this.onDuplicateSlideClicked}
        onDeleteSlideClicked={this.onDeleteSlideClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CreateNavigationStemContainer, {}, ['slides', 'blocks']));