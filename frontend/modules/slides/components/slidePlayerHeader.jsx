import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';

const SlidePlayerHeader = ({
  hasBackButton,
  onPreviousSlideClicked,
}) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div>
        {(hasBackButton) && (
          <FlatButton icon="back" onClick={onPreviousSlideClicked} />
        )}
      </div>
      <div>
        <FlatButton icon="menu" />
      </div>
    </div>
  );
};

export default SlidePlayerHeader;