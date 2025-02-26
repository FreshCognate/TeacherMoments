import React from 'react';
import getString from '~/modules/ls/helpers/getString';
import Alert from '~/uikit/alerts/components/alert';
import Button from '~/uikit/buttons/components/button';

const SuggestionBlockPlayer = ({
  block,
  isOpen,
  onSuggestionButtonClicked
}) => {
  return (
    <div>
      {(block.showSuggestionAs === 'BUTTON' && !isOpen) && (
        <Button text={"Information"} color="primary" onClick={onSuggestionButtonClicked} />
      )}
      {(block.showSuggestionAs === 'VISIBLE' || isOpen) && (
        <Alert text={getString({ model: block, field: 'body' })} type="info" />
      )}
    </div>
  );
};

export default SuggestionBlockPlayer;