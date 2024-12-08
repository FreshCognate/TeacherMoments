import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import SlidesPanelItem from './slidesPanelItem';
import map from 'lodash/map';

const SlidesPanel = ({
  slides,
  onAddSlideClicked,
  onDeleteSlideClicked,
}) => {
  return (
    <div className="p-1">
      <div>
        <FlatButton text="Add slide" icon="create" onClick={onAddSlideClicked} />
      </div>
      <div>
        {map(slides, (slide) => {
          return (
            <SlidesPanelItem
              key={slide._id}
              slide={slide}
              onDeleteSlideClicked={onDeleteSlideClicked}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SlidesPanel;