import ScenarioBuilderItemContent from './scenarioBuilderItemContent';
import ScenarioBuilderItemActions from './scenarioBuilderItemActions';
import ScenarioBuilderItemChildren from './scenarioBuilderItemChildren';

const ScenarioBuilderItem = ({
  slide,
  slideSelection,
  blocksCount,
  triggersCount,
  layerIndex,
  location,
  isSelected,
  isEditing,
  isEditingChildren,
  childrenOffset,
  shouldRenderChildren,
  onAddChildSlideClicked,
  onToggleChildSlidesClicked,
  onSelectSlideClicked,
  onEditSlideClicked,
  onCancelEditingClicked
}) => {
  const newLayerIndex = layerIndex + 1;
  return (
    <div className="">
      <div className="flex justify-center">
        <div className="relative">
          <ScenarioBuilderItemContent
            location={location}
            slide={slide}
            blocksCount={blocksCount}
            triggersCount={triggersCount}
            isSelected={isSelected}
            isEditing={isEditing}
            onSelectSlideClicked={onSelectSlideClicked}
            onEditSlideClicked={onEditSlideClicked}
            onCancelEditingClicked={onCancelEditingClicked}
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