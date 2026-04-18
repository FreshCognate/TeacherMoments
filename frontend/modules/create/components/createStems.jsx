import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';
import map from 'lodash/map';

const CreateStems = ({
  childStems,
  isCreating,
  deletingId,
  getSlideCountForStem,
  onCreateStemClicked,
  onEditStemClicked,
  onDeleteStemClicked,
  onStemClicked
}) => {
  return (
    <div className="py-2">
      {map(childStems, (stem) => {
        const isDeleting = stem._id === deletingId;
        const className = classnames(
          "bg-lm-1 dark:bg-dm-2 rounded-md h-8 mb-2 border border-lm-3 dark:border-dm-2 flex items-center justify-between px-3 cursor-pointer hover:border-lm-5 dark:hover:border-dm-4 transition-colors",
          { "opacity-50": isDeleting }
        );
        return (
          <div
            key={stem._id}
            className={className}
            onClick={() => onStemClicked(stem.ref)}
          >
            <span className="text-xs text-lm-5 dark:text-dm-5 font-medium">
              {stem.name} ({getSlideCountForStem(stem.ref)})
            </span>
            <div className="flex items-center gap-2">
              <FlatButton
                icon="edit"
                size="sm"
                onClick={(event) => { event.stopPropagation(); onEditStemClicked(stem); }}
              />
              <FlatButton
                icon="delete"
                size="sm"
                isDisabled={isDeleting}
                onClick={(event) => { event.stopPropagation(); onDeleteStemClicked(stem._id); }}
              />
            </div>
          </div>
        );
      })}
      <FlatButton
        text="Create Stem"
        icon="create"
        isDisabled={isCreating}
        onClick={onCreateStemClicked}
      />
    </div>
  );
};

export default CreateStems;
