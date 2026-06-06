import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';
import map from 'lodash/map';
import Icon from '~/uikit/icons/components/icon';
import CreateNavigationSlideIcon from './createNavigationSlideIcon';
import getSlideCountForStem from '../helpers/getSlideCountForStem';

const CreateStems = ({
  activeStemRef,
  isInRootStem,
  childStems,
  deletingId,
  onEditStemClicked,
  onDeleteStemClicked,
  onStemClicked
}) => {
  return (
    <div className={classnames("pb-1 bg-lm-2 dark:bg-dm-2 rounded-b-lg -mt-1", {
      "pt-2 px-1": childStems && childStems.length > 0 && isInRootStem,
      "pt-0": !childStems || childStems.length === 0,
      "pt-2 px-0": childStems && childStems.length > 0 && !isInRootStem
    })}>
      {map(childStems, (stem) => {
        const isDeleting = stem._id === deletingId;
        const isSelected = stem.ref === activeStemRef && !isInRootStem;
        const className = classnames(
          "bg-lm-1 dark:bg-dm-2 rounded-md h-8 border border-lm-3 dark:border-dm-2 flex items-center justify-between cursor-pointer hover:border-lm-5 dark:hover:border-dm-4 transition-colors",
          { "outline outline-blue-500 outline-1 -outline-offset-2": isSelected },
          { "opacity-50": isDeleting },
          {
            "px-2": isInRootStem,
            "px-0 border-0 hover:bg-lm-3 dark:hover:bg-dm-3": !isInRootStem
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
