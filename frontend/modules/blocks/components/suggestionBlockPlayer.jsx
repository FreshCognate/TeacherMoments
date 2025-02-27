import React from 'react';
import getString from '~/modules/ls/helpers/getString';
import Alert from '~/uikit/alerts/components/alert';
import Button from '~/uikit/buttons/components/button';

const ALERT_TYPES = {
  INFO: 'info',
  WARNING: 'warning'
}

const SuggestionBlockPlayer = ({
  block,
}) => {
  return (
    <div>
      <Alert text={getString({ model: block, field: 'body' })} type={ALERT_TYPES[block.suggestionType]} />
    </div>
  );
};

export default SuggestionBlockPlayer;