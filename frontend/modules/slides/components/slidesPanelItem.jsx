import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';
import Body from '~/uikit/content/components/body';
import EditSlideContainer from '../containers/editSlideContainer';

const SlidesPanelItem = ({
  slide,
  isLastSlide,
  isEditing,
  isSelected,
  onEditSlideClicked,
  onDeleteSlideClicked,
  onSlideClicked,
  onSortUpClicked,
  onSortDownClicked,
  onCancelEditSlideClicked
}) => {
  return (
    <div className={classnames("bg-lm-2 dark:bg-dm-2 my-3 -outline-offset-1 rounded-md cursor-pointer group", {
      "outline outline-primary-regular dark:outline-primary-light": isSelected,
      "hover:outline hover:outline-lm-3 hover:dark:outline-dm-3": !isSelected
    })} onClick={() => {
      if (!isEditing) {
        onSlideClicked(slide._id)
      }
    }}>

      <div className="flex items-center justify-between p-3">
        <div>
          <Body body={slide.name ? slide.name : `Slide ${slide.sortOrder + 1}`} size="xs" />
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100">
          {(isEditing) && (
            <FlatButton icon="done" text="Done" size="sm" color="primary" onClick={(event) => {
              event.stopPropagation();
              onCancelEditSlideClicked(slide._id);
            }} />
          )}
          {(!isEditing) && (
            <FlatButton icon="edit" text="Edit" size="sm" color="primary" onClick={(event) => {
              event.stopPropagation();
              onEditSlideClicked(slide._id);
            }} />
          )}
        </div>
      </div>
      {(isEditing) && (
        <div>
          <EditSlideContainer slideId={slide._id} />
        </div>
      )}

      {(!isEditing) && (

        <div className="flex items-center justify-between py-1 bg-lm-3 dark:bg-dm-3 px-3 opacity-0 group-hover:opacity-100">
          <div className="flex items-center">
            <FlatButton icon="delete" color="warning" onClick={() => onDeleteSlideClicked(slide._id)} />
          </div>
          <div className="flex items-center">
            <FlatButton icon="sortUp" className="mr-3" isDisabled={slide.sortOrder === 0} onClick={() => onSortUpClicked(slide.sortOrder)} />
            <FlatButton icon="sortDown" isDisabled={isLastSlide} onClick={() => onSortDownClicked(slide.sortOrder)} />
          </div>
        </div>

      )}
    </div>
  );
};

export default SlidesPanelItem;