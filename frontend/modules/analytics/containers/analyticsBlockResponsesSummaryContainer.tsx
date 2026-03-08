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

interface AnalyticsBlockResponsesSummaryContainerState {
  summary: string | null;
  block: any;
  isLoading: boolean;
}

class AnalyticsBlockResponsesSummaryContainer extends Component<AnalyticsBlockResponsesSummaryContainerProps, AnalyticsBlockResponsesSummaryContainerState> {

  state = {
    summary: null,
    block: null,
    isLoading: true
  };

  componentDidMount() {
    this.fetchSummary();
  }

  fetchSummary = async () => {
    try {
      const { id: cohortId, scenarioId } = this.props.router.params;
      const { blockColumn } = this.props;

      const response = await axios.post('/api/responses/summary', {
        cohortId,
        scenarioId,
        blockRef: blockColumn.ref
      });

      const sockets = await getSockets();

      sockets.on(`workers:generate:${response.data.jobId}`, (data: any) => {
        if (data.event === 'GENERATED') {
          this.setState({ summary: data.payload?.summary || null, block: data.payload?.block || null, isLoading: false });
        }
      });
    } catch (error) {
      handleRequestError(error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { blockColumn, responses } = this.props;
    const { summary, block, isLoading } = this.state;

    return (
      <AnalyticsBlockResponsesSummary
        blockColumn={blockColumn}
        block={block}
        responses={responses}
        summary={summary}
        isLoading={isLoading}
      />
    );
  }
}

export default WithRouter(AnalyticsBlockResponsesSummaryContainer);
