import React, { Component } from 'react';
import axios from 'axios';
import WithRouter from '~/core/app/components/withRouter';
import getSockets from '~/core/sockets/helpers/getSockets';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import AnalyticsBlockResponsesSummary from '../components/analyticsBlockResponsesSummary';
import { BlockColumn, UserResponse } from '../analytics.types';

interface AnalyticsBlockResponsesSummaryContainerProps {
  blockColumn: BlockColumn;
  responses: UserResponse[];
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

interface AnalyticsBlockResponsesSummaryContainerState {
  summaryData: SummaryData | null;
  block: any;
  isLoading: boolean;
}

class AnalyticsBlockResponsesSummaryContainer extends Component<AnalyticsBlockResponsesSummaryContainerProps, AnalyticsBlockResponsesSummaryContainerState> {

  state = {
    summaryData: null,
    block: null,
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
      const { blockColumn } = this.props;

      const response = await axios.post('/api/responses/summary', {
        cohortId,
        scenarioId,
        blockRef: blockColumn.ref
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
          this.setState({ summaryData, block: payload.block || null, isLoading: false });
        }
      });
    } catch (error) {
      handleRequestError(error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { blockColumn, responses } = this.props;
    const { summaryData, block, isLoading } = this.state;

    return (
      <AnalyticsBlockResponsesSummary
        blockColumn={blockColumn}
        block={block}
        responses={responses}
        summaryData={summaryData}
        isLoading={isLoading}
      />
    );
  }
}

export default WithRouter(AnalyticsBlockResponsesSummaryContainer);
