import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';
import map from 'lodash/map';
import Icon from '~/uikit/icons/components/icon';
import CreateNavigationSlidePreview from './createNavigationSlidePreview';
import CreateNavigationSlideIcon from './createNavigationSlideIcon';

const CreateStems = ({
  isInRootStem,
  childStems,
  deletingId,
  getSlideCountForStem,
  onEditStemClicked,
  onDeleteStemClicked,
  onStemClicked
}) => {
  return (
    <div className={classnames("pb-1 bg-lm-2 dark:bg-dm-2 rounded-b-lg mb-2 -mt-1", {
      "pt-2 px-1": childStems && childStems.length > 0 && isInRootStem,
      "pt-0": !childStems || childStems.length === 0,
      "pt-2 px-0": childStems && childStems.length > 0 && !isInRootStem
    })}>
      {map(childStems, (stem) => {
        const isDeleting = stem._id === deletingId;
        const className = classnames(
          "bg-lm-1 dark:bg-dm-2 rounded-md h-8 border border-lm-3 dark:border-dm-2 flex items-center justify-between cursor-pointer hover:border-lm-5 dark:hover:border-dm-4 transition-colors",
          { "opacity-50": isDeleting },
          {
            "px-2": isInRootStem,
            "px-0 border-0": !isInRootStem
          }
        );
        return (
          <div
            key={stem._id}
            className={className}
            onClick={() => onStemClicked(stem.ref)}
          >
            {(!isInRootStem) && (
              <CreateNavigationSlideIcon icon="branching" />
            )}
            {(isInRootStem) && (
              <>
                <span className="text-xs text-lm-5 dark:text-dm-5 font-medium flex items-center gap-x-2">
                  <Icon icon="branching" size={12} />{stem.name} ({getSlideCountForStem(stem.ref)})
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
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CreateStems;
