import React, { Component } from 'react';
import ShareScenario from '../components/shareScenario';
import WithCache from '~/core/cache/containers/withCache';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import axios from 'axios';
import WithRouter from '~/core/app/components/withRouter';
import getScenarioErrors from '../helpers/getScenarioErrors';

class ShareScenarioContainer extends Component {

  state = {
    isPublishing: false,
    hasCopied: false
  }

  componentDidMount = () => {
    this.props.scenario.fetch();
  }

  getPublishLink = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/play/${this.props.scenario.data.publishLink}`;
    } else {
      return '';
    }
  }

  getIsScenarioValid = () => {
    return getScenarioErrors().length === 0;
  }

  onPublishScenarioClicked = () => {
    this.setState({ isPublishing: true });
    axios.post(`/api/publishes`, {
      scenarioId: this.props.scenario.data._id
    }).then(() => {
      this.props.scenario.fetch().then(() => {
        this.setState({ isPublishing: false });
      });
    }).catch((error) => {
      handleRequestError(error);
      this.setState({ isPublishing: false });
    })
  }

  onCopyLinkClicked = async () => {
    await navigator.clipboard.writeText(this.getPublishLink());
    this.setState({ hasCopied: true });
    setTimeout(() => {
      this.setState({ hasCopied: false });
    }, 2000);
  }

  render() {
    const { hasCopied, isPublishing } = this.state;
    return (
      <ShareScenario
        scenario={this.props.scenario.data}
        publishLink={this.getPublishLink()}
        isPublishing={isPublishing}
        hasCopied={hasCopied}
        isScenarioValid={this.getIsScenarioValid()}
        onPublishScenarioClicked={this.onPublishScenarioClicked}
        onCopyLinkClicked={this.onCopyLinkClicked}
      />
    );
  }
};

export default WithRouter(WithCache(ShareScenarioContainer, {}, ['scenario']));