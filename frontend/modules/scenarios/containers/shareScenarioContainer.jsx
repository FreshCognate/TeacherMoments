import React, { Component } from 'react';
import ShareScenario from '../components/shareScenario';
import WithCache from '~/core/cache/containers/withCache';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import axios from 'axios';
import WithRouter from '~/core/app/components/withRouter';

class ShareScenarioContainer extends Component {

  state = {
    isPublishing: false,
  }

  onPublishScenarioClicked = () => {
    this.setState({ isPublishing: true });
    axios.post(`/api/publishes`, {
      scenarioId: this.props.scenario.data._id
    }).then(() => {
      this.props.scenario.fetch();
      this.setState({ isPublishing: false });
    }).catch((error) => {
      handleRequestError(error);
      this.setState({ isPublishing: false });
    })
  }

  render() {
    return (
      <ShareScenario
        scenario={this.props.scenario.data}
        isPublishing={this.state.isPublishing}
        onPublishScenarioClicked={this.onPublishScenarioClicked}
      />
    );
  }
};

export default WithRouter(WithCache(ShareScenarioContainer, {}, ['scenario']));