import React, { Component } from 'react';
import axios from 'axios';
import WithRouter from '~/core/app/components/withRouter';
import getSockets from '~/core/sockets/helpers/getSockets';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import AnalyticsSlideResponsesSummary from '../components/analyticsSlideResponsesSummary';
import { SlideGroup, UserResponse } from '../analytics.types';

interface AnalyticsSlideResponsesSummaryContainerProps {
  slideGroup: SlideGroup;
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

interface AnalyticsSlideResponsesSummaryContainerState {
  summaryData: SummaryData | null;
  slide: any;
  blocks: any[];
  isLoading: boolean;
}

class AnalyticsSlideResponsesSummaryContainer extends Component<AnalyticsSlideResponsesSummaryContainerProps, AnalyticsSlideResponsesSummaryContainerState> {

  state = {
    summaryData: null,
    slide: null,
    blocks: [],
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
      const { slideGroup } = this.props;

      const response = await axios.post('/api/responses/summary', {
        cohortId,
        scenarioId,
        slideRef: slideGroup.slideRef
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
          this.setState({
            summaryData,
            slide: payload.slide || null,
            blocks: payload.blocks || [],
            isLoading: false
          });
        }
      });
    } catch (error) {
      handleRequestError(error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { slideGroup, responses } = this.props;
    const { summaryData, slide, blocks, isLoading } = this.state;

    return (
      <AnalyticsSlideResponsesSummary
        slideGroup={slideGroup}
        slide={slide}
        blocks={blocks}
        responses={responses}
        summaryData={summaryData}
        isLoading={isLoading}
      />
    );
  }
}

export default WithRouter(AnalyticsSlideResponsesSummaryContainer);
