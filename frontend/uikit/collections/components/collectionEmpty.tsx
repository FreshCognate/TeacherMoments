import React from 'react';
import Button from '~/uikit/buttons/components/button';
import Icon from '~/uikit/icons/components/icon';
import { CollectionEmptyAttributes } from '../collections.types';

interface CollectionEmptyProps {
  attributes: CollectionEmptyAttributes;
  onActionClicked?: ({ action }: { action: string }) => void;
}

const CollectionEmpty = ({ attributes, onActionClicked }: CollectionEmptyProps) => {
  return (
    <div className="text-center py-8 px-4 border border-lm-2 dark:border-dm-2 rounded-md">
      <h3 className="text-black/80 dark:text-white/80 mb-2">
        {attributes.title}
      </h3>
      <p className="text-black/60 dark:text-white/60 mb-4 text-sm">
        {attributes.body}
      </p>
      {attributes.action && onActionClicked && (
        <div className="flex justify-center">
          <Button
            text={attributes.action.text}
            color="primary"
            onClick={() => onActionClicked({ action: attributes.action!.action })}
          />
        </div>
      )}
      {attributes.help && (
        <div className="mt-6 bg-lm-1 dark:bg-dm-1 rounded-lg p-4 flex items-center gap-3 text-left">
          <div className="text-black/40 dark:text-white/40 shrink-0">
            <Icon icon="info" size={18} />
          </div>
          <p className="text-black/50 dark:text-white/50 text-xs leading-relaxed">
            {attributes.help}
          </p>
        </div>
      )}
    </div>
  );
};

export default CollectionEmpty;
