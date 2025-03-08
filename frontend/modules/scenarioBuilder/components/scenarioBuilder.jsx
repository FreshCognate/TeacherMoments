import React from 'react';
import ScenarioBuilderItemContainer from '../containers/scenarioBuilderItemContainer';
import ScenarioEditorToolbarContainer from '~/modules/scenarios/containers/scenarioEditorToolbarContainer';
import ScenarioPreviewContainer from '~/modules/scenarios/containers/scenarioPreviewContainer';
import EditBlockContainer from '~/modules/blocks/containers/editBlockContainer';
import classnames from 'classnames';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';
import Loading from '~/uikit/loaders/components/loading';
import ActioningBar from '~/uikit/actionBars/components/actioningBar';

const ScenarioBuilder = ({
  rootSlide,
  displayMode,
  slideSelection,
  blockId,
  actionElement,
  actionType,
  actionId,
  isEditingBlock,
  isActioning,
  isCreatingFromAction,
  onCancelActioningClicked
}) => {
  const isDarkMode = window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
  const backgroundDotColor = isDarkMode ? '#222' : '#ddd'

  return (
    <div id="scenario-builder" style={{ height: 'calc(100vh - 68px', marginTop: '28px' }} className={classnames("relative overflow-x-hidden overflow-y-scroll", {
      "outline outline-2 -outline-offset-2 outline-blue-500": isActioning
    })}>
      {(isActioning) && (
        <ActioningBar
          actionElement={actionElement}
          actionType={actionType}
          isCreatingFromAction={isCreatingFromAction}
          onCancelActioningClicked={onCancelActioningClicked}
        />
      )}
      <div className={"bg-lm-0 dark:bg-dm-0 min-h-screen"} style={{
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
              actionId={actionId}
              actionElement={actionElement}
              isSelected={true}
              isActioning={isActioning}
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