import React, { Fragment } from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import map from 'lodash/map';
import SelectOptions from '~/uikit/select/components/selectOptions';
import each from 'lodash/each';
import Body from '~/uikit/content/components/body';
import getBlockDisplayName from '~/modules/blocks/helpers/getBlockDisplayName';
import getString from '~/modules/ls/helpers/getString';

const FeedbackItemConditions = ({
  value,
  prompts,
  onAddConditionClicked,
  onRemoveConditionClicked,
  onPromptConditionValueChanged,
  onEditPromptConditionClicked
}) => {
  return (
    <div>
      <div>
        {map(value, (condition, index) => {
          return (
            <Fragment key={condition._id}>
              {(index > 0) && (
                <div className="my-2 text-lg">
                  OR
                </div>
              )}
              <div key={index} className="rounded-md overflow-hidden">
                <div>
                  {map(prompts, (prompt) => {
                    const options = [{
                      value: null,
                      text: 'Set condition'
                    }];

                    each(prompt.options, (option) => {
                      if (option.value) {
                        options.push({
                          value: option.value,
                          text: option.value
                        });
                      }
                    });
                    const blockDisplayName = getBlockDisplayName(prompt);
                    const blocksByRef = condition.blocksByRef || {};
                    return (
                      <div key={prompt._id} className="flex items-start justify-between bg-lm-1 dark:bg-dm-2 mb-0.5 p-4 last:border-b-0">
                        <div className="w-1/2">
                          <div className="flex items-center mb-2">
                            <div className="w-1/4">
                              <Body body="Block type:" size="sm" />
                            </div>
                            <div>
                              <Body body={blockDisplayName} size="sm" />
                            </div>
                          </div>
                          <div className="flex w-full items-center">
                            <div className="w-1/4">
                              <Body body="Prompt:" size="sm" />
                            </div>
                            <div>
                              <Body body={getString({ model: prompt, field: 'body' })} size="sm" />
                            </div>
                          </div>
                        </div>
                        <div className="w-1/2">
                          <div className="flex w-full items-center">
                            <div className="w-1/4">
                              <Body body="Has value:" size="sm" />
                            </div>
                            <FlatButton icon="edit" onClick={onEditPromptConditionClicked} />
                            {/* <SelectOptions
                              value={blocksByRef[prompt.ref] || null}
                              options={options}
                              onChange={(value) => {
                                onPromptConditionValueChanged({ value, blockRef: prompt.ref, conditionId: condition._id });
                              }}
                            /> */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="min-w-10">
                  {(value.length > 1) && (
                    <FlatButton title="Delete condition" icon="delete" onClick={onRemoveConditionClicked} />
                  )}
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
      <div className="mt-2">
        <FlatButton
          text="Add condition"
          onClick={onAddConditionClicked}
        />
      </div>
    </div>
  );
};

export default FeedbackItemConditions;