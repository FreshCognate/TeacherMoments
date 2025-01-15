import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';

const ScnarioBuilderItemActions = ({
  slide,
  selectedSlide,
  shouldRenderChildren,
  onAddChildSlideClicked,
  onToggleChildSlidesClicked
}) => {
  let prefix = '';
  if (selectedSlide > 0) {
    prefix = `${selectedSlide}/`;
  }
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
      <div className="absolute right-2 opacity-40">
        <Body
          body={`${prefix}${slide.children.length} child${slide.children.length === 0 || slide.children.length > 1 ? 'ren' : ''}`}
          size="xs"
        />
      </div>
    </div>
  );
};

export default ScnarioBuilderItemActions;