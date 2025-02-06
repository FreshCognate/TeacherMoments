import ScenarioBuilderItemContent from './scenarioBuilderItemContent';
import ScenarioBuilderItemActions from './scenarioBuilderItemActions';
import ScenarioBuilderItemChildren from './scenarioBuilderItemChildren';
import FlatButton from '~/uikit/buttons/components/flatButton';

const ScenarioBuilderItem = ({
  slide,
  parent,
  slideSelection,
  selectedSlide,
  blocksCount,
  triggersCount,
  layerIndex,
  location,
  isSelected,
  isEditing,
  isEditingChildren,
  isEditingSibling,
  isOptionsOpen,
  isDeleting,
  isDuplicating,
  isLockedFromEditing,
  childrenOffset,
  shouldRenderChildren,
  onAddChildSlideClicked,
  onToggleChildSlidesClicked,
  onSelectSlideClicked,
  onEditSlideClicked,
  onCancelEditingClicked,
  onOptionsToggled,
  onOptionClicked,
  onPasteSlideClicked
}) => {
  const newLayerIndex = layerIndex + 1;
  return (
    <div className={isDeleting ? 'opacity-20' : ''} id={`scenario-builder-slide-${slide._id}`}>
      <div className="flex justify-center">
        <div className="relative">
          {(!slide.isRoot && isSelected && isDuplicating) && (
            <>
              <div className="absolute z-20 -left-8 top-1/2 -mt-3">
                <FlatButton icon="paste" isCircular onClick={() => onPasteSlideClicked('BEFORE')} />
              </div>
              <div className="absolute z-20 -right-8 top-1/2 -mt-3">
                <FlatButton icon="paste" isCircular onClick={() => onPasteSlideClicked('AFTER')} />
              </div>
            </>
          )}
          <ScenarioBuilderItemContent
            location={location}
            slide={slide}
            blocksCount={blocksCount}
            triggersCount={triggersCount}
            isSelected={isSelected}
            isEditing={isEditing}
            isEditingSibling={isEditingSibling}
            isOptionsOpen={isOptionsOpen}
            isDuplicating={isDuplicating}
            isLockedFromEditing={isLockedFromEditing}
            onSelectSlideClicked={onSelectSlideClicked}
            onEditSlideClicked={onEditSlideClicked}
            onCancelEditingClicked={onCancelEditingClicked}
            onOptionsToggled={onOptionsToggled}
            onOptionClicked={onOptionClicked}
          />
          {(isSelected) && (
            <ScenarioBuilderItemActions
              slide={slide}
              selectedSlide={selectedSlide}
              isDuplicating={isDuplicating}
              shouldRenderChildren={shouldRenderChildren}
              onAddChildSlideClicked={onAddChildSlideClicked}
              onToggleChildSlidesClicked={onToggleChildSlidesClicked}
              onPasteSlideClicked={onPasteSlideClicked}
            />
          )}
        </div>
      </div>
      {(slide.children.length > 0 && shouldRenderChildren) && (
        <ScenarioBuilderItemChildren
          parent={parent}
          children={slide.children}
          slideSelection={slideSelection}
          childrenOffset={childrenOffset}
          newLayerIndex={newLayerIndex}
          isDuplicating={isDuplicating}
          isEditing={isEditing}
          isEditingChildren={isEditingChildren}
        />
      )}
    </div>
  );
};

export default ScenarioBuilderItem;