import React from 'react';
import CollectionEmpty from '~/uikit/collections/components/collectionEmpty';

const AnalyticsSidePanel: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <CollectionEmpty
        attributes={{
          title: 'No response selected',
          body: 'Select a response to view it in the slide context'
        }}
      />
    </div>
  );
};

export default AnalyticsSidePanel;
