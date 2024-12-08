import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';

const SlidesPanelItem = ({
  slide,
  onDeleteSlideClicked
}) => {
  return (
    <div className="bg-lm-2 mb-1 rounded-md p-2">
      {slide.name}
      <div className="flex items-center">
        <FlatButton icon="edit" />
        <FlatButton icon="delete" onClick={() => onDeleteSlideClicked(slide._id)} />
      </div>
    </div>
  );
};

export default SlidesPanelItem;