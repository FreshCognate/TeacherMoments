import React from 'react';
import map from 'lodash/map';
import getString from '~/modules/ls/helpers/getString';
import Button from '~/uikit/buttons/components/button';

const ActionsBlockPlayer = ({
  block,
  onActionClicked
}) => {
  return (
    <div className="flex items-center justify-between">
      {map(block.actions, (action) => {
        return (
          <Button
            key={action._id}
            text={getString({ model: action, field: 'text' })}
            color={"primary"}
            onClick={() => onActionClicked(action.slideRef)}
          />
        )
      })}
    </div>
  );
};

export default ActionsBlockPlayer;