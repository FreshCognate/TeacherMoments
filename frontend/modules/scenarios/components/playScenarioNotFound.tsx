import React from 'react';
import CollectionEmpty from '~/uikit/collections/components/collectionEmpty';

const PlayScenarioNotFound = () => {
  return (
    <div className="p-4">
      <CollectionEmpty
        attributes={{
          title: "This scenario link doesn't work.",
          body: 'Check the link, or ask your facilitator for a new one.'
        }}
      />
    </div>
  );
};

export default PlayScenarioNotFound;
