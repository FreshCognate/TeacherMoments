import React from 'react';
import map from 'lodash/map';
import each from 'lodash/each';
import noop from 'lodash/noop';
import Loading from '~/uikit/loaders/components/loading';
import getBlockComponent from '~/modules/blocks/helpers/getBlockComponent';
import { SlideGroup, UserResponse } from '../analytics.types';

interface SummarySection {
  title: string;
  content: string;
}

interface SummaryData {
  overview: string;
  sections: SummarySection[];
  summary: string;
}

interface AnalyticsSlideResponsesSummaryProps {
  slideGroup: SlideGroup;
  slide: any;
  blocks: any[];
  responses: UserResponse[];
  summaryData: SummaryData | null;
  isLoading: boolean;
}

const AnalyticsSlideResponsesSummary: React.FC<AnalyticsSlideResponsesSummaryProps> = ({
  slideGroup,
  slide,
  blocks,
  responses,
  summaryData,
  isLoading
}) => {

  const renderSections = () => {
    if (!summaryData?.sections?.length) return null;

    const sectionElements: React.ReactNode[] = [];

    each(summaryData.sections, (section, index) => {
      sectionElements.push(
        <div
          key={index}
          className="py-3 border-b border-black/10 dark:border-white/10 last:border-b-0"
        >
          {section.title && (
            <h3 className="text-sm font-medium text-black/80 dark:text-white/80 mb-1">
              {section.title}
            </h3>
          )}
          <p className="text-sm text-black/60 dark:text-white/60">
            {section.content}
          </p>
        </div>
      );
    });

    return sectionElements;
  };

  return (
    <div className="p-4">
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            {slide?.name && (
              <div className="text-sm font-medium text-black/60 dark:text-white/60 mb-4">
                {slide.name}
              </div>
            )}
            {map(blocks, (block) => {
              const Block = getBlockComponent({ blockType: block.blockType });
              if (!Block) return null;

              return (
                <div
                  key={block._id}
                  className="mb-4 last:mb-0 p-4 bg-lm-2 rounded-md dark:bg-dm-2"
                >
                  <Block
                    block={block}
                    blockTracking={{}}
                    isResponseBlock={true}
                    onUpdateBlockTracking={noop}
                    navigateTo={noop}
                  />
                </div>
              );
            })}
          </div>
          <div>
            {summaryData && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-black/80 dark:text-white/80 mb-2 underline">Overview</h2>
                  <p className="text-sm text-black/60 dark:text-white/60">{summaryData.overview}</p>
                </div>
                {summaryData.sections?.length > 0 && (
                  <div>
                    <h2 className="text-base font-semibold text-black/80 dark:text-white/80 mb-2 underline">Key findings</h2>
                    {renderSections()}
                  </div>
                )}
                {summaryData.summary && (
                  <div>
                    <h2 className="text-base font-semibold text-black/80 dark:text-white/80 mb-2 underline">Summary</h2>
                    <p className="text-sm text-black/60 dark:text-white/60">{summaryData.summary}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsSlideResponsesSummary;
