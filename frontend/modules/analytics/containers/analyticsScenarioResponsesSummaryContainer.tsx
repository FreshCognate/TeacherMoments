import React, { Component } from 'react';
import axios from 'axios';
import WithRouter from '~/core/app/components/withRouter';
import getSockets from '~/core/sockets/helpers/getSockets';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import AnalyticsScenarioResponsesSummary from '../components/analyticsScenarioResponsesSummary';

interface AnalyticsScenarioResponsesSummaryContainerProps {
  scenarioName?: string;
  actions?: any;
  router?: any;
}

interface AnalyticsScenarioResponsesSummaryContainerState {
  summary: string | null;
  isLoading: boolean;
}

class AnalyticsScenarioResponsesSummaryContainer extends Component<AnalyticsScenarioResponsesSummaryContainerProps, AnalyticsScenarioResponsesSummaryContainerState> {

  state = {
    summary: null,
    isLoading: true
  };

  componentDidMount() {
    this.fetchSummary();
  }

  fetchSummary = async () => {
    try {
      const { id: cohortId, scenarioId } = this.props.router.params;

      const response = await axios.post('/api/responses/summary', {
        cohortId,
        scenarioId
      });

      const sockets = await getSockets();

      sockets.on(`workers:generate:${response.data.jobId}`, (data: any) => {
        if (data.event === 'GENERATED') {
          this.setState({ summary: data.payload?.summary || null, isLoading: false });
        }
      });
    } catch (error) {
      handleRequestError(error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { summary, isLoading } = this.state;

    return (
      <AnalyticsScenarioResponsesSummary
        scenarioName={this.props.scenarioName}
        summary={summary}
        isLoading={isLoading}
      />
    );
  }
}

export default WithRouter(AnalyticsScenarioResponsesSummaryContainer);
