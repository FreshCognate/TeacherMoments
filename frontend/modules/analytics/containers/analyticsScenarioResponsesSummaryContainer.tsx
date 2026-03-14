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

interface SummarySection {
  title: string;
  content: string;
}

interface SummaryData {
  overview: string;
  sections: SummarySection[];
  summary: string;
}

interface AnalyticsScenarioResponsesSummaryContainerState {
  summaryData: SummaryData | null;
  isLoading: boolean;
}

class AnalyticsScenarioResponsesSummaryContainer extends Component<AnalyticsScenarioResponsesSummaryContainerProps, AnalyticsScenarioResponsesSummaryContainerState> {

  state = {
    summaryData: null,
    isLoading: true
  };

  componentDidMount() {
    this.fetchSummary();
  }

  fetchSummary = async () => {
    try {
      const { id, scenarioId: scenarioIdParam } = this.props.router.params;
      const cohortId = scenarioIdParam ? id : undefined;
      const scenarioId = scenarioIdParam || id;

      const response = await axios.post('/api/responses/summary', {
        cohortId,
        scenarioId
      });

      const sockets = await getSockets();

      sockets.on(`workers:generate:${response.data.jobId}`, (data: any) => {
        if (data.event === 'GENERATED') {
          const payload = data.payload || {};
          const summaryData = payload.overview ? {
            overview: payload.overview,
            sections: payload.sections || [],
            summary: payload.summary || ''
          } : null;
          this.setState({ summaryData, isLoading: false });
        }
      });
    } catch (error) {
      handleRequestError(error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { summaryData, isLoading } = this.state;

    return (
      <AnalyticsScenarioResponsesSummary
        scenarioName={this.props.scenarioName}
        summaryData={summaryData}
        isLoading={isLoading}
      />
    );
  }
}

export default WithRouter(AnalyticsScenarioResponsesSummaryContainer);
