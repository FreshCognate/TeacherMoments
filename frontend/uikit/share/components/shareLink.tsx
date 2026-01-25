import React, { useState } from 'react';
import Button from '~/uikit/buttons/components/button';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';

const ShareLink = ({
  shareLink
}: { shareLink: string }) => {

  const [hasCopied, setHasCopied] = useState(false);

  const onCopyLinkClicked = async () => {
    await navigator.clipboard.writeText(shareLink);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }

  return (
    <div className="w-full bg-lm-0 dark:bg-dm-1 border border-lm-3 dark:border-dm-1 rounded-lg px-4 py-6">
      <div>
        <div className="flex items-center relative">
          <Button icon="copy" className="mr-2" onClick={onCopyLinkClicked} />
          <div className="bg-lm-2 dark:bg-dm-2 py-1 px-4 rounded-md text-nowrap overflow-x-auto overflow-y-hidden w-full">
            {`${shareLink}`}
          </div>
        </div>
        {(hasCopied) && (
          <div className="flex items-center absolute">
            <Icon icon="copy" size={16} className="ml-2 mr-1 text-primary-regular/60 dark:text-primary-light/60" />
            <Body className="text-primary-regular/60 dark:text-primary-light/60" body="Copied!" size="xs" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareLink;