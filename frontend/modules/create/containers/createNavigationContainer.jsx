import React, { Component } from 'react';
import CreateNavigation from '../components/createNavigation';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import setEditingMode from '../helpers/setEditingMode';
import getScenarioDetails from '../../run/helpers/getScenarioDetails';
import find from 'lodash/find';
import filter from 'lodash/filter';

class CreateNavigationContainer extends Component {

  state = {
    isCreating: false,
    isDuplicating: false,
    navigationType: 'SLIDES',
    deletingId: null
  }

  componentDidMount() {
    this.ensureActiveStemRef();
  }

  componentDidUpdate() {
    this.ensureActiveStemRef();
  }

  ensureActiveStemRef = () => {
    if (this.props.editor.data.activeStemRef) return;
    const derivedStemRef = this.getActiveStemRef();
    if (derivedStemRef) {
      this.props.editor.set({ activeStemRef: derivedStemRef });
    }
  }

  getActiveStemRef = () => {
    const { activeStemRef } = this.props.editor.data;
    if (activeStemRef) return activeStemRef;
    const { activeSlideId } = getScenarioDetails();
    const activeSlide = find(this.props.slides.data, { _id: activeSlideId });
    if (activeSlide?.stemRef) return activeSlide.stemRef;
    const rootStem = find(this.props.stems.data, { isRoot: true });
    if (rootStem) return rootStem.ref;
    return null;
  }

  getActiveStem = () => {
    const activeStemRef = this.getActiveStemRef();
    return find(this.props.stems.data, { ref: activeStemRef });
  }

  getHasChildStems = () => {
    const activeStemRef = this.getActiveStemRef();
    if (!activeStemRef) return false;
    return filter(this.props.stems.data, { stemRef: activeStemRef }).length > 0;
  }

  getCurrentStemOfSlides = () => {
    const activeStemRef = this.getActiveStemRef();
    if (!activeStemRef) return this.props.slides.data;
    return filter(this.props.slides.data, { stemRef: activeStemRef });
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
    this.setState({ isCreating: true });
    const scenarioId = this.props.scenario.data._id;
    axios.post(`/api/slides`, {
      scenarioId,
      sortOrder: this.getNewSlideSortOrder(),
      stemRef: this.getActiveStemRef()
    }).then((response) => {
      const slideId = response.data.slide._id;
      this.props.slides.fetch().then(() => {
        setEditingMode();
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

  onBackToParentStemClicked = () => {
    const activeStem = this.getActiveStem();
    if (!activeStem?.stemRef) return;
    this.props.editor.set({ activeStemRef: activeStem.stemRef });
    const parentSlides = filter(this.props.slides.data, { stemRef: activeStem.stemRef });
    if (parentSlides.length > 0) {
      const scenarioId = this.props.scenario.data._id;
      this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${parentSlides[0]._id}`, {
        replace: true
      });
    }
  }

  onCreateStemClicked = () => {
    this.setState({ isCreating: true });
    const scenarioId = this.props.scenario.data._id;
    const activeStemRef = this.getActiveStemRef();
    axios.post('/api/stems', {
      scenarioId,
      stemRef: activeStemRef
    }).then((response) => {
      const newStem = response.data.stem;
      Promise.all([
        this.props.stems.fetch(),
        this.props.slides.fetch()
      ]).then(() => {
        this.props.editor.set({ activeStemRef: newStem.ref });
        const slidesCache = getCache('slides');
        const stemSlides = filter(slidesCache.data, { stemRef: newStem.ref });
        if (stemSlides.length > 0) {
          this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${stemSlides[0]._id}`, {
            replace: true
          });
        }
        this.setState({ isCreating: false });
      });
    }).catch((error) => {
      this.setState({ isCreating: false });
      handleRequestError(error);
    });
  }

  render() {
    const { isCreating, deletingId, isDuplicating } = this.state;
    const { activeSlideId } = getScenarioDetails();
    const { navigationMode } = this.props.editor.data;
    const activeStem = this.getActiveStem();
    return (
      <CreateNavigation
        scenarioId={this.props.scenario.data._id}
        slides={this.getCurrentStemOfSlides()}
        blocks={this.props.blocks.data}
        activeSlideId={activeSlideId}
        activeStem={activeStem}
        hasChildStems={this.getHasChildStems()}
        navigationMode={navigationMode}
        isCreating={isCreating}
        deletingId={deletingId}
        isDuplicating={isDuplicating}
        onAddSlideClicked={this.onAddSlideClicked}
        onDuplicateSlideClicked={this.onDuplicateSlideClicked}
        onDeleteSlideClicked={this.onDeleteSlideClicked}
        onToggleNavigationTypeClicked={this.onToggleNavigationTypeClicked}
        onBackToParentStemClicked={this.onBackToParentStemClicked}
        onCreateStemClicked={this.onCreateStemClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CreateNavigationContainer, null, ['slides', 'blocks', 'scenario', 'editor', 'stems']));