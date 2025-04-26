import React from 'react';
import Badge from '~/uikit/badges/components/badge';
import map from 'lodash/map';
import FlatButton from '~/uikit/buttons/components/flatButton';

const CollectionItem = ({
  id,
  name,
  meta,
  actions,
  onActionClicked,
}) => {
  return (
    <div className="bg-lm-1 dark:bg-dm-1 p-4 rounded-md mb-2 flex items-center justify-between">
      <div>

        <div className="text-black/80 dark:text-white/80 text-lg">
          {name}
        </div>
        {(meta && meta.length > 0) && (
          <div className="flex mt-2">
            {map(meta, (metaItem) => {
              return (
                <div className="mr-1" key={metaItem.value}>
                  <Badge text={`${metaItem.name}: ${metaItem.value}`} />
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className="flex items-center">
        {map(actions, (action) => {
          return (
            <FlatButton
              key={action.action}
              text={action.text}
              onClick={() => onActionClicked({ itemId: id, action: action.action })}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CollectionItem;