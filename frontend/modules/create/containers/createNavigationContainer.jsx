import React, { Component } from 'react';
import CreateNavigation from '../components/createNavigation';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import filter from 'lodash/filter';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import getScenarioDetails from '../../run/helpers/getScenarioDetails';
import find from 'lodash/find';

class CreateNavigationContainer extends Component {

  state = {
    isCreating: false,
    isDuplicating: false,
    navigationType: 'SLIDES',
    deletingId: null
  }

  getCurrentStemOfSlides = () => {
    return filter(this.props.slides.data, (slide) => {
      if (!slide.parentRef) return slide;
    })
  }

  getSelectedSlideSortOrder = () => {
    const { activeSlideId } = getScenarioDetails();
    return find(this.props.slides.data, { _id: activeSlideId }).sortOrder;
  }

  getNewSlideSortOrder = () => {
    const { activeSlideId } = getScenarioDetails();
    if (activeSlideId === 'CONSENT') return 0;
    if (activeSlideId === 'SUMMARY') return this.getCurrentStemOfSlides().length;
    return this.getSelectedSlideSortOrder() + 1;
  }

  onAddSlideClicked = () => {
    let parentRef;
    this.setState({ isCreating: true });
    const scenarioId = this.props.scenario.data._id;
    axios.post(`/api/slides`, {
      scenarioId: this.props.scenario.data._id,
      parentRef,
      sortOrder: this.getNewSlideSortOrder()
    }).then((response) => {
      const slideId = response.data.slide._id;
      this.props.slides.fetch().then(() => {
        this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${slideId}`, {
          replace: true
        })
        this.setState({ isCreating: false });
      });
    }).catch((error) => {
      this.props.slides.fetch();
      this.setState({ isCreating: false });
      handleRequestError(error);
    })
  }

  onDuplicateSlideClicked = (slideId) => {
    this.setState({ isDuplicating: true });
    const scenarioId = this.props.scenario.data._id;
    axios.post(`/api/slides`, {
      scenarioId,
      slideId,
    }).then((response) => {
      const slideId = response.data.slide._id;
      this.props.blocks.fetch();
      this.props.slides.fetch().then(() => {
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

  onDeleteSlideClicked = (slideId) => {
    const selectedSlideSortOrder = this.getSelectedSlideSortOrder();
    this.setState({ deletingId: slideId });
    axios.delete(`/api/slides/${slideId}`).then(() => {

      this.props.slides.fetch().then(() => {

        this.setState({ deletingId: null }, () => {
          const scenarioId = this.props.scenario.data._id;
          const slideWithSameSortOrderAsDeleted = find(this.props.slides.data, { sortOrder: selectedSlideSortOrder });

          if (slideWithSameSortOrderAsDeleted) {
            this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${slideWithSameSortOrderAsDeleted._id}`, {
              replace: true
            })
          } else {
            const slideBeforeDeletedSlide = find(this.props.slides.data, { sortOrder: selectedSlideSortOrder - 1 });
            this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${slideBeforeDeletedSlide._id}`, {
              replace: true
            })
          }

        });
      });

    }).catch((error) => {
      this.props.slides.fetch();
      this.setState({ deletingId: null });
      handleRequestError(error);
    })
  }

  onToggleNavigationTypeClicked = () => {
    this.props.editor.set({ navigationMode: this.props.editor.data.navigationMode === 'SLIDES' ? 'STEM' : 'SLIDES' })
  }

  render() {
    const { isCreating, deletingId, isDuplicating } = this.state;
    const { activeSlideId } = getScenarioDetails();
    const { navigationMode } = this.props.editor.data;
    return (
      <CreateNavigation
        scenarioId={this.props.scenario.data._id}
        slides={this.getCurrentStemOfSlides()}
        blocks={this.props.blocks.data}
        activeSlideId={activeSlideId}
        navigationMode={navigationMode}
        isCreating={isCreating}
        deletingId={deletingId}
        isDuplicating={isDuplicating}
        onAddSlideClicked={this.onAddSlideClicked}
        onDuplicateSlideClicked={this.onDuplicateSlideClicked}
        onDeleteSlideClicked={this.onDeleteSlideClicked}
        onToggleNavigationTypeClicked={this.onToggleNavigationTypeClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CreateNavigationContainer, null, ['slides', 'blocks', 'scenario', 'editor']));