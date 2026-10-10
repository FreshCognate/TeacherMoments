import React, { Component } from 'react';
import CreateNavigation from '../components/createNavigation';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import setEditingMode from '../helpers/setEditingMode';
import find from 'lodash/find';
import getActiveStem from '~/modules/stems/helpers/getActiveStem';
import getActiveStemRef from '~/modules/stems/helpers/getActiveStemRef';
import getNewSlideSortOrder from '~/modules/stems/helpers/getNewSlideSortOrder';
import getParentStemSlideId from '~/modules/stems/helpers/getParentStemSlideId';

class CreateNavigationContainer extends Component {

  state = {
    isCreating: false,
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
    const derivedStemRef = getActiveStemRef();
    if (derivedStemRef) {
      this.props.editor.set({ activeStemRef: derivedStemRef });
    }
  }

  onAddSlideClicked = () => {
    this.setState({ isCreating: true });
    const scenarioId = this.props.scenario.data._id;
    axios.post(`/api/slides`, {
      scenarioId,
      sortOrder: getNewSlideSortOrder(),
      stemRef: getActiveStemRef()
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

  onToggleNavigationTypeClicked = () => {
    this.props.editor.set({ navigationMode: this.props.editor.data.navigationMode === 'SLIDES' ? 'STEM' : 'SLIDES' })
  }

  onBackToParentClicked = ({ parentStemSlideId }) => {
    if (parentStemSlideId) {
      const parentStemSlide = find(this.props.slides.data, { _id: parentStemSlideId });
      this.props.editor.set({ activeStemRef: parentStemSlide.stemRef });
    }
  }

  render() {
    const { isCreating } = this.state;
    const parentStemSlideId = getParentStemSlideId();
    const activeStem = getActiveStem();
    return (
      <CreateNavigation
        scenarioId={this.props.scenario.data._id}
        parentStemSlideId={parentStemSlideId}
        stemName={activeStem?.name || ''}
        activeStem={activeStem}
        isCreating={isCreating}
        isInRootStem={activeStem?.isRoot ?? true}
        onAddSlideClicked={this.onAddSlideClicked}
        onDuplicateSlideClicked={this.onDuplicateSlideClicked}
        onToggleNavigationTypeClicked={this.onToggleNavigationTypeClicked}
        onBackToParentClicked={this.onBackToParentClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CreateNavigationContainer, null, ['slides', 'blocks', 'scenario', 'editor', 'stems', 'triggers']));