import React from 'react';
import Title from '~/uikit/content/components/title';
import Loading from '~/uikit/loaders/components/loading';
import CollectionEmpty from '~/uikit/collections/components/collectionEmpty';

const Invite = ({
  isInviteNotFound,
  isInviteCheckFailed
}: {
  isInviteNotFound: boolean,
  isInviteCheckFailed: boolean
}) => {
  if (isInviteNotFound) {
    return (
      <div className="p-4">
        <CollectionEmpty
          attributes={{
            title: "This invite link doesn't work.",
            body: 'It may have been replaced by a newer link. Ask your facilitator for the current one.'
          }}
        />
      </div>
    );
  }
  if (isInviteCheckFailed) {
    return (
      <div className="p-4">
        <CollectionEmpty
          attributes={{
            title: "This invite link couldn't be checked.",
            body: 'Reload this page to try again.'
          }}
        />
      </div>
    );
  }
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex items-center">
        <div>
          <Loading />
        </div>
        <Title title="Checking invite..." />
      </div>
    </div>
  );
};

export default Invite;
