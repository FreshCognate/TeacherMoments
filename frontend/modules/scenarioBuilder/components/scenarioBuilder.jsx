import React from 'react';
import ScenarioBuilderItemContainer from '../containers/scenarioBuilderItemContainer';
import ScenarioEditorToolbarContainer from '~/modules/scenarios/containers/scenarioEditorToolbarContainer';
import ScenarioPreviewContainer from '~/modules/scenarios/containers/scenarioPreviewContainer';
import EditBlockContainer from '~/modules/blocks/containers/editBlockContainer';
import classnames from 'classnames';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';

const ScenarioBuilder = ({
  rootSlide,
  displayMode,
  slideSelection,
  blockId,
  isEditingBlock,
  isDuplicating,
  onCancelDuplicatingClicked
}) => {
  const isDarkMode = window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
  const backgroundDotColor = isDarkMode ? '#222' : '#ddd'

  return (
    <div id="scenario-builder" style={{ height: 'calc(100vh - 68px', marginTop: '28px' }} className={classnames("relative overflow-x-hidden overflow-y-scroll", {
      "outline outline-2 -outline-offset-2 outline-blue-500": isDuplicating
    })}>
      {(isDuplicating) && (
        <div className="text-white bg-blue-500 fixed w-full top-0 z-50 flex items-center justify-between px-4 py-4" style={{ top: '68px' }}>
          <div>
            <Body body="Pick a place to copy the slide to" size="sm" />
          </div>
          <div>
            <FlatButton text="Cancel" onClick={onCancelDuplicatingClicked} />
          </div>
        </div>
      )}
      <div className={"bg-lm-1 dark:bg-dm-0 min-h-screen"} style={{
        backgroundSize: "20px 20px",
        backgroundPosition: "-9px -9px",
        backgroundImage: displayMode === 'EDITING' ? `radial-gradient(${backgroundDotColor} 1px, transparent 0)` : 'none',
        paddingBottom: '200vh'
      }}>
        <div className="flex p-5 justify-center">
          <ScenarioEditorToolbarContainer />
        </div>
        <div className="flex justify-center pt-5">
          {(displayMode === 'EDITING') && (
            <ScenarioBuilderItemContainer
              slide={rootSlide}
              slideSelection={slideSelection}
              layerIndex={-1}
              isSelected={true}
            />
          )}
          {(displayMode === 'PREVIEW') && (
            <ScenarioPreviewContainer />
          )}
        </div>
        {(isEditingBlock && blockId) && (
          <EditBlockContainer blockId={blockId} />
        )}
      </div>
    </div>
  );
};

export default ScenarioBuilder;