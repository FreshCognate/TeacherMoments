import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';
import Loading from '~/uikit/loaders/components/loading';

const ScnarioBuilderItemActions = ({
  slide,
  selectedSlide,
  isActioning,
  isAddingChild,
  shouldRenderChildren,
  onAddChildSlideClicked,
  onToggleChildSlidesClicked,
  onActionClicked
}) => {
  let prefix = '';
  if (selectedSlide > 0) {
    prefix = `${selectedSlide}/`;
  }
  return (
    <div className="absolute z-10 -bottom-8 h-6 flex justify-center items-center w-full left-0">
      <div className="mx-1">
        {(isActioning) && (
          <FlatButton icon="paste" isCircular color="primary" onClick={() => onActionClicked("CHILD")} />
        )}
      </div>
      {slide.children.length > 0 && (
        <div className="mx-1">
          <FlatButton icon={shouldRenderChildren ? "close" : "open"} isCircular onClick={() => onToggleChildSlidesClicked(shouldRenderChildren ? 'CLOSE' : 'OPEN')} />
        </div>
      )}
      <div className="absolute right-2 opacity-40 flex items-center">
        <Body
          body={`${prefix}${slide.children.length} child${slide.children.length === 0 || slide.children.length > 1 ? 'ren' : ''}`}
          size="xs"
          className="mr-4"
        />
        {(isAddingChild) && (
          <Loading className="!flex !w-auto !p-0" />
        )}
        {(!isActioning && !isAddingChild) && (
          <FlatButton icon="add" isCircular onClick={onAddChildSlideClicked} />
        )}
      </div>
    </div>
  );
};

export default ScnarioBuilderItemActions;