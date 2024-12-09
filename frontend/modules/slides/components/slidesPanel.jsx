import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import SlidesPanelItem from './slidesPanelItem';
import map from 'lodash/map';

const SlidesPanel = ({
  slides,
  selectedSlideId,
  onAddSlideClicked,
  onSlideClicked,
  onDeleteSlideClicked,
  onSortUpClicked,
  onSortDownClicked
}) => {
  return (
    <div className="p-1">
      <div>
        <FlatButton text="Add slide" icon="create" onClick={onAddSlideClicked} />
      </div>
      <div>
        {map(slides, (slide) => {

          let isSelected = (slide._id === selectedSlideId);

          return (
            <SlidesPanelItem
              key={slide._id}
              slide={slide}
              isSelected={isSelected}
              isLastSlide={slide.sortOrder === slides.length - 1}
              onSlideClicked={onSlideClicked}
              onDeleteSlideClicked={onDeleteSlideClicked}
              onSortUpClicked={onSortUpClicked}
              onSortDownClicked={onSortDownClicked}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SlidesPanel;