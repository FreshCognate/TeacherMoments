import React, { Component } from 'react';
import BlockSelector from '../components/blockSelector';
import WithRouter from '~/core/app/components/withRouter';
import getCache from '~/core/cache/helpers/getCache';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';

class BlockSelectorContainer extends Component {

  onAddBlockTypeClicked = (blockType) => {
    this.props.actions.onCloseButtonClicked();
    const searchParams = new URLSearchParams(this.props.router.location.search);
    const slideId = searchParams.get('slide');
    const scenario = getCache('scenario')
    const scenarioId = scenario.data._id;
    axios.post(`/api/blocks`, { blockType, slide: slideId, scenario: scenarioId }).then(() => {
      const blocks = getCache('blocks');
      blocks.fetch();
    }).catch(handleRequestError);
  }

  render() {
    return (
      <BlockSelector
        onAddBlockTypeClicked={this.onAddBlockTypeClicked}
      />
    );
  }
};

export default WithRouter(BlockSelectorContainer);