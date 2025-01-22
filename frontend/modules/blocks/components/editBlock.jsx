import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import FlatButton from '~/uikit/buttons/components/flatButton';

const EditBlock = ({
  schema,
  block,
  hasPreviousButton,
  hasNextButton,
  onCloseEditorClicked,
  onEditBlockUpdate,
  onNavigateToPreviousBlock,
  onNavigateToNextBlock
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-dm-2 bg-opacity-60 dark:bg-dm-2 dark:bg-opacity-60 p-2 z-30 flex justify-end"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCloseEditorClicked();
        }
      }}
    >
      <div className="bg-lm-0 dark:bg-dm-0  rounded-lg overflow-scroll">
        <div className="flex justify-between px-2 py-2 bg-lm-1 dark:bg-dm-1">
          <div className="flex items-center">
            <FlatButton
              text="Previous block"
              icon="up"
              className="mr-2"
              size="sm"
              isDisabled={!hasPreviousButton}
              onClick={onNavigateToPreviousBlock}
            />
            <FlatButton
              text="Next block"
              icon="down"
              size="sm"
              isDisabled={!hasNextButton}
              onClick={onNavigateToNextBlock}
            />
          </div>
          <div>
            <FlatButton isCircular icon="cancel" onClick={onCloseEditorClicked} />
          </div>
        </div>
        {(block) && (

          <div className="p-6">
            <FormContainer
              renderKey={block.blockType}
              schema={schema}
              model={block}
              onUpdate={onEditBlockUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditBlock;