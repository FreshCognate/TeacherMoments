import ScenarioBuilderItemContent from './scenarioBuilderItemContent';
import ScenarioBuilderItemActions from './scenarioBuilderItemActions';
import ScenarioBuilderItemChildren from './scenarioBuilderItemChildren';
import FlatButton from '~/uikit/buttons/components/flatButton';
import ActioningButton from '~/uikit/buttons/components/actioningButton';

const ScenarioBuilderItem = ({
  slide,
  parent,
  slideSelection,
  selectedSlide,
  blocksCount,
  triggersCount,
  layerIndex,
  location,
  actionType,
  isSelected,
  isEditing,
  isEditingChildren,
  isEditingSibling,
  isOptionsOpen,
  isDeleting,
  isActioning,
  isAddingChild,
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
  onActionClicked,
  onRequestAccessClicked
}) => {

  const newLayerIndex = layerIndex + 1;

  return (
    <div className={isDeleting ? 'opacity-20' : ''} style={{ scrollMarginTop: "50px" }} id={`scenario-builder-slide-${slide._id}`}>
      <div className="flex justify-center">
        <div className="relative">
          {(!slide.isRoot && isSelected && isActioning) && (
            <>
              <div className="absolute z-20 -left-8 top-1/2 -mt-3">
                <ActioningButton
                  actionType={actionType}
                  position="BEFORE"
                  onActionClicked={onActionClicked}
                />
              </div>
              <div className="absolute z-20 -right-8 top-1/2 -mt-3">
                <ActioningButton
                  actionType={actionType}
                  position="AFTER"
                  onActionClicked={onActionClicked}
                />
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
            isActioning={isActioning}
            isLockedFromEditing={isLockedFromEditing}
            onSelectSlideClicked={onSelectSlideClicked}
            onEditSlideClicked={onEditSlideClicked}
            onCancelEditingClicked={onCancelEditingClicked}
            onOptionsToggled={onOptionsToggled}
            onOptionClicked={onOptionClicked}
            onRequestAccessClicked={onRequestAccessClicked}
          />
          {(isSelected) && (
            <ScenarioBuilderItemActions
              slide={slide}
              selectedSlide={selectedSlide}
              actionType={actionType}
              isActioning={isActioning}
              isAddingChild={isAddingChild}
              shouldRenderChildren={shouldRenderChildren}
              onAddChildSlideClicked={onAddChildSlideClicked}
              onToggleChildSlidesClicked={onToggleChildSlidesClicked}
              onActionClicked={onActionClicked}
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
          actionType={actionType}
          isActioning={isActioning}
          isEditing={isEditing}
          isEditingChildren={isEditingChildren}
        />
      )}
    </div>
  );
};

export default ScenarioBuilderItem;