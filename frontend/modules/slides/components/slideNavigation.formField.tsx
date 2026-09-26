import React from 'react';
import find from 'lodash/find';
import map from 'lodash/map';
import Body from '~/uikit/content/components/body';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';

const SlideNavigationFormField = ({
  value,
  schema,
  isEditing,
  onEditClicked,
  onNavigationOptionClicked
}) => {

  const selectedOptionText = find(schema.options, { value });

  const selectedOptionClassName = classnames("flex items-center justify-between p-2", {
    "border-b-2 border-lm-3 dark:border-dm-3 ": isEditing
  })

  return (
    <div>
      <div className="rounded-md border-2 border-lm-3 dark:border-dm-3 overflow-hidden">
        <div className={selectedOptionClassName}>
          <div>
            <Body body={selectedOptionText.text} size="sm" className="text-black/60 dark:text-white/60" />
            {(isEditing) && (
              <Body body={selectedOptionText.description} size="xs" className="mt-1 text-black/30 dark:text-white/30 w-11/12" />
            )}
          </div>
          {(isEditing) && (
            <FlatButton icon="done" onClick={onEditClicked} />
          )}
          {(!isEditing) && (
            <FlatButton icon="edit" onClick={onEditClicked} />
          )}
        </div>
        {(isEditing) && (
          <div>
            {(map(schema.options, (option) => {
              if (option.value === value) return null;
              return (
                <div
                  className="border-b-2 border-lm-3 dark:border-dm-3 p-2 last:border-b-0 hover:bg-lm-2 dark:hover:bg-dm-2 cursor-pointer"
                  onClick={() => onNavigationOptionClicked(option.value)}>
                  <Body body={option.text} size="sm" className=" text-black/60 dark:text-white/60" />
                  <Body body={option.description} size="xs" className="mt-1 text-black/30 dark:text-white/30 pr-2 w-11/12" />
                </div>
              )
            }))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideNavigationFormField;