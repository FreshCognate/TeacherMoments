import React, { Component } from 'react';
import CreateNavigation from '../components/createNavigation';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import setEditingMode from '../helpers/setEditingMode';
import find from 'lodash/find';
import nth from 'lodash/nth';
import dropRight from 'lodash/dropRight';
import getActiveStem from '~/modules/stems/helpers/getActiveStem';
import getActiveStemRef from '~/modules/stems/helpers/getActiveStemRef';
import getNewSlideSortOrder from '~/modules/stems/helpers/getNewSlideSortOrder';
import getParentStemSlideId from '~/modules/stems/helpers/getParentStemSlideId';
import isLastSlideBeforeNavigation from '~/modules/stems/helpers/isLastSlideBeforeNavigation';
import getAddLastSlideToStemDialog from '~/modules/stems/helpers/getAddLastSlideToStemDialog';
import getScenarioDetails from '~/modules/run/helpers/getScenarioDetails';
import addModal from '~/core/dialogs/helpers/addModal';

class CreateNavigationContainer extends Component {

  state = {
    isCreating: false,
    deletingId: null
  }

  onAddSlideClicked = () => {
    const { activeSlideId } = getScenarioDetails();
    if (!isLastSlideBeforeNavigation({ slideId: activeSlideId })) {
      return this.addSlide();
    }
    addModal(getAddLastSlideToStemDialog('ADD'), (state, { type }) => {
      if (state === 'ACTION' && type === 'CONFIRM') {
        this.addSlide();
      }
    });
  }

  addSlide = () => {
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

  onBackToParentClicked = ({ parentStemSlideId }) => {
    if (parentStemSlideId) {
      const parentStemSlide = find(this.props.slides.data, { _id: parentStemSlideId });
      const stemPath = this.props.editor.data.stemPath || [];
      this.props.editor.set({
        stemPath: nth(stemPath, -2) === parentStemSlide.stemRef ? dropRight(stemPath) : [parentStemSlide.stemRef]
      });
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
        onBackToParentClicked={this.onBackToParentClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CreateNavigationContainer, null, ['slides', 'blocks', 'scenario', 'editor', 'stems']));