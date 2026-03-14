import React, { Component } from 'react';
import axios from 'axios';
import WithRouter from '~/core/app/components/withRouter';
import getSockets from '~/core/sockets/helpers/getSockets';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import AnalyticsUserResponsesSummary from '../components/analyticsUserResponsesSummary';

interface AnalyticsUserResponsesSummaryContainerProps {
  userId: string;
  userName: string;
  scenarioId?: string;
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

interface AnalyticsUserResponsesSummaryContainerState {
  summaryData: SummaryData | null;
  isLoading: boolean;
}

class AnalyticsUserResponsesSummaryContainer extends Component<AnalyticsUserResponsesSummaryContainerProps, AnalyticsUserResponsesSummaryContainerState> {

  state = {
    summaryData: null,
    isLoading: true
  };

  componentDidMount() {
    this.fetchSummary();
  }

  fetchSummary = async () => {
    try {
      let cohortId;
      let scenarioId = this.props.scenarioId;

      if (!scenarioId) {
        const { id, scenarioId: scenarioIdParam } = this.props.router.params;
        cohortId = scenarioIdParam ? id : undefined;
        scenarioId = scenarioIdParam || id;
      }

      const response = await axios.post('/api/responses/summary', {
        cohortId,
        scenarioId,
        userId: this.props.userId
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
      <AnalyticsUserResponsesSummary
        userName={this.props.userName}
        scenarioName={this.props.scenarioName}
        summaryData={summaryData}
        isLoading={isLoading}
      />
    );
  }
}

export default WithRouter(AnalyticsUserResponsesSummaryContainer);
