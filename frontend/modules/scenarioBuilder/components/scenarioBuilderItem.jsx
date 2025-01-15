import ScenarioBuilderItemContent from './scenarioBuilderItemContent';
import ScenarioBuilderItemActions from './scenarioBuilderItemActions';
import ScenarioBuilderItemChildren from './scenarioBuilderItemChildren';

const ScenarioBuilderItem = ({
  slide,
  parent,
  slideSelection,
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
  childrenOffset,
  shouldRenderChildren,
  onAddChildSlideClicked,
  onToggleChildSlidesClicked,
  onSelectSlideClicked,
  onEditSlideClicked,
  onCancelEditingClicked,
  onOptionsToggled,
  onOptionClicked
}) => {
  const newLayerIndex = layerIndex + 1;
  return (
    <div className={isDeleting ? 'opacity-20' : ''} id={`scenario-builder-slide-${slide._id}`}>
      <div className="flex justify-center">
        <div className="relative">
          <ScenarioBuilderItemContent
            location={location}
            slide={slide}
            blocksCount={blocksCount}
            triggersCount={triggersCount}
            isSelected={isSelected}
            isEditing={isEditing}
            isEditingSibling={isEditingSibling}
            isOptionsOpen={isOptionsOpen}
            onSelectSlideClicked={onSelectSlideClicked}
            onEditSlideClicked={onEditSlideClicked}
            onCancelEditingClicked={onCancelEditingClicked}
            onOptionsToggled={onOptionsToggled}
            onOptionClicked={onOptionClicked}
          />
          {(isSelected) && (
            <ScenarioBuilderItemActions
              slide={slide}
              shouldRenderChildren={shouldRenderChildren}
              onAddChildSlideClicked={onAddChildSlideClicked}
              onToggleChildSlidesClicked={onToggleChildSlidesClicked}
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
          isEditing={isEditing}
          isEditingChildren={isEditingChildren}
        />
      )}
    </div>
  );
};

export default ScenarioBuilderItem;