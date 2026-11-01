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
import addModal from '~/core/dialogs/helpers/addModal';
import setEditingMode from '../helpers/setEditingMode';
import axios from 'axios';
import getSelectedSlideSortOrder from '~/modules/stems/helpers/getSelectedSlideSortOrder';
import find from 'lodash/find';
import getChildStems from '~/modules/stems/helpers/getChildStems';
import getAddLastSlideToStemDialog from '~/modules/stems/helpers/getAddLastSlideToStemDialog';
import getIsLastSlideBeforeNavigation from '~/modules/stems/helpers/getIsLastSlideBeforeNavigation';

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
    const slide = find(this.props.slides.data, { _id: slideId });
    const slideName = slide?.name || `${(slide?.sortOrder ?? 0) + 1}`;
    addModal({
      title: `Delete slide: ${slideName}`,
      body: 'Are you sure you want to delete this slide?',
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }, {
        type: 'DELETE',
        text: 'Delete',
        color: 'danger'
      }]
    }, (state: string, { type }: { type: string }) => {
      if (state === 'ACTION' && type === 'DELETE') {
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
    });
  }

  onDuplicateSlideClicked = (slideId: string) => {
    const isLastSlideBeforeNavigation = getIsLastSlideBeforeNavigation({ slideId });
    if (!isLastSlideBeforeNavigation) {
      return this.duplicateSlide({ slideId, isLastSlideBeforeNavigation });
    }
    addModal(getAddLastSlideToStemDialog('DUPLICATE'), (state: string, { type }: { type: string }) => {
      if (state === 'ACTION' && type === 'CONFIRM') {
        this.duplicateSlide({ slideId, isLastSlideBeforeNavigation });
      }
    });
  }

  duplicateSlide = ({ slideId, isLastSlideBeforeNavigation }: { slideId: string, isLastSlideBeforeNavigation: boolean }) => {
    this.setState({ isDuplicating: true });
    const scenarioId = this.props.scenarioId;
    axios.post(`/api/slides`, {
      scenarioId,
      slideId,
      isLastSlideBeforeNavigation
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
      isInRootStem,
    } = this.props;

    const stemSlides = getCurrentStemSlides();
    const { activeSlideId } = getScenarioDetails();
    const activeStem = getActiveStem();
    if (!activeStem) return null;
    const activeStemChildren = getChildStems({ stem: activeStem });
    const activeStemChildrenCount = activeStemChildren.length;
    return (
      <CreateNavigationStem
        scenarioId={scenarioId}
        stemSlides={stemSlides}
        blocks={this.props.blocks.data}
        activeSlideId={activeSlideId}
        activeStem={activeStem}
        activeStemChildrenCount={activeStemChildrenCount}
        deletingId={this.state.deletingId}
        isDuplicating={this.state.isDuplicating}
        isInRootStem={isInRootStem}
        onDuplicateSlideClicked={this.onDuplicateSlideClicked}
        onDeleteSlideClicked={this.onDeleteSlideClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CreateNavigationStemContainer, {}, ['slides', 'blocks']));