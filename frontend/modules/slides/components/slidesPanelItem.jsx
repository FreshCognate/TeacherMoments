import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';

const SlidesPanelItem = ({
  slide,
  onDeleteSlideClicked,
  onSlideClicked
}) => {
  return (
    <div className="bg-lm-2 dark:bg-dm-2 my-2 rounded-md p-2" onClick={() => onSlideClicked(slide._id)}>
      {slide.name ? slide.name : `Slide ${slide.sortOrder + 1}`}
      <div className="flex items-center">
        <FlatButton icon="edit" />
        <FlatButton icon="delete" onClick={() => onDeleteSlideClicked(slide._id)} />
      </div>
    </div>
  );
};

export default SlidesPanelItem;