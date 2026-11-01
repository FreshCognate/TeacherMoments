import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';
import map from 'lodash/map';
import Icon from '~/uikit/icons/components/icon';
import getSlideCountForStem from '../helpers/getSlideCountForStem';
import Badge from '~/uikit/badges/components/badge';
import Body from '~/uikit/content/components/body';

const CreateStems = ({
  activeStemRef,
  childStems,
  deletingId,
  onEditStemClicked,
  onDeleteStemClicked,
  onStemClicked,
  onCreateStemClicked,
  onEditNavigationClicked
}) => {
  return (
    <div className="bg-lm-2 dark:bg-dm-2 rounded-lg p-1 group">

      {(childStems.length > 0) && (
        <div className="border-b border-b-lm-3 dark:border-b-dm-3 py-1 hidden group-hover:block">
          {map(childStems, (stem) => {
            const isDeleting = stem._id === deletingId;
            const isSelected = stem.ref === activeStemRef;
            const className = classnames(
              "bg-lm-2 dark:bg-dm-2 rounded-md h-8 border border-lm-2 dark:border-dm-2 flex items-center justify-between cursor-pointer hover:border-lm-4 dark:hover:border-dm-4 transition-colors",
              "px-2 h-8",
              { "outline outline-blue-500 outline-1 -outline-offset-2": isSelected },
              { "opacity-50": isDeleting },
              { "opacity-0 group-hover:opacity-100 transition-opacity": !isDeleting }
            );
            return (
              <div
                key={stem._id}
                className={className}
                onClick={() => onStemClicked(stem.ref)}
              >
                <span className="text-xs text-lm-5 dark:text-dm-5 font-medium flex items-center gap-x-2">
                  <Icon icon="branching" size={12} />
                  {stem.name}
                </span>


                <div className="flex items-center gap-2">
                  <Badge icon="slides" size="sm" text={getSlideCountForStem(stem.ref)} />
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
        </div>
      )}
      <div className="p-1 pt-2 hidden group-hover:block">
        <FlatButton text="Create branching stem" size="sm" icon="create" onClick={onCreateStemClicked} />
      </div>
      <div className="flex justify-between  p-1 pb-1">
        <Body body="Navigation" size="sm" className='opacity-60' />
        <div className="flex items-center">
          {(childStems.length > 0) && (
            <span className="text-xs text-lm-5 dark:text-dm-5 font-medium flex items-center gap-x-2 group-hover:hidden">
              <Icon icon="branching" size={12} />
              {childStems.length}
            </span>
          )}
          {(childStems.length > 0) && (
            <FlatButton className="hidden group-hover:block" icon="edit" onClick={onEditNavigationClicked} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStems;
