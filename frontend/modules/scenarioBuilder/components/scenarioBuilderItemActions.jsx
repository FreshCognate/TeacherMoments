import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';

const ScnarioBuilderItemActions = ({
  slide,
  shouldRenderChildren,
  onAddChildSlideClicked,
  onToggleChildSlidesClicked
}) => {
  return (
    <div className="absolute z-10 -bottom-8 flex justify-center items-center w-full left-0">
      <div className="mx-1">
        <FlatButton icon="add" isCircular onClick={onAddChildSlideClicked} />
      </div>
      {slide.children.length > 0 && (
        <div className="mx-1">
          <FlatButton icon={shouldRenderChildren ? "close" : "open"} isCircular onClick={() => onToggleChildSlidesClicked(shouldRenderChildren ? 'CLOSE' : 'OPEN')} />
        </div>
      )}
    </div>
  );
};

export default ScnarioBuilderItemActions;