import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';
import Body from '~/uikit/content/components/body';

const SlidesPanelItem = ({
  slide,
  isLastSlide,
  isSelected,
  onDeleteSlideClicked,
  onSlideClicked,
  onSortUpClicked,
  onSortDownClicked
}) => {
  return (
    <div className={classnames("bg-lm-2 dark:bg-dm-2 my-2 rounded-md p-2 cursor-pointer", {
      "outline outline-primary-regular dark:outline-primary-light": isSelected
    })} onClick={() => onSlideClicked(slide._id)}>
      <Body body={slide.name ? slide.name : `Slide ${slide.sortOrder + 1}`} className="mb-2" />
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FlatButton icon="edit" className="mr-3" />
          <FlatButton icon="delete" onClick={() => onDeleteSlideClicked(slide._id)} />
        </div>
        <div className="flex items-center">
          <FlatButton icon="sortUp" className="mr-3" isDisabled={slide.sortOrder === 0} onClick={() => onSortUpClicked(slide.sortOrder)} />
          <FlatButton icon="sortDown" isDisabled={isLastSlide} onClick={() => onSortDownClicked(slide.sortOrder)} />
        </div>
      </div>
    </div>
  );
};

export default SlidesPanelItem;