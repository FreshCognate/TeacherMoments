import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import SlidesPanelItem from './slidesPanelItem';
import map from 'lodash/map';

const SlidesPanel = ({
  slides,
  selectedSlideId,
  isEditingSection,
  onAddSlideClicked,
  onEditSlideClicked,
  onSlideClicked,
  onDeleteSlideClicked,
  onSortUpClicked,
  onSortDownClicked,
  onCancelEditSlideClicked
}) => {
  return (
    <div className="p-1">
      <div>
        <FlatButton text="Add slide" icon="create" onClick={onAddSlideClicked} />
      </div>
      <div>
        {map(slides, (slide) => {

          const isSelected = (slide._id === selectedSlideId);

          const isEditing = isEditingSection && isSelected;

          return (
            <SlidesPanelItem
              key={slide._id}
              slide={slide}
              isSelected={isSelected}
              isEditing={isEditing}
              isLastSlide={slide.sortOrder === slides.length - 1}
              onSlideClicked={onSlideClicked}
              onEditSlideClicked={onEditSlideClicked}
              onDeleteSlideClicked={onDeleteSlideClicked}
              onSortUpClicked={onSortUpClicked}
              onSortDownClicked={onSortDownClicked}
              onCancelEditSlideClicked={onCancelEditSlideClicked}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SlidesPanel;