import React, { Fragment } from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import map from 'lodash/map';
import find from 'lodash/find';
import Body from '~/uikit/content/components/body';
import getBlockDisplayName from '~/modules/blocks/helpers/getBlockDisplayName';
import getString from '~/modules/ls/helpers/getString';
import Badge from '~/uikit/badges/components/badge';
import Alert from '~/uikit/alerts/components/alert';
import Icon from '~/uikit/icons/components/icon';

const FeedbackItemConditions = ({
  value,
  prompts,
  onAddConditionClicked,
  onRemoveConditionClicked,
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
              <div className="rounded-md overflow-hidden">
                <div>
                  {map(prompts, (prompt) => {

                    const conditionPrompt = find(condition.prompts, { ref: prompt.ref });

                    const blockDisplayName = getBlockDisplayName(prompt);

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
                            <div className="w-5/6">
                              <Body body={prompt.blockType === 'MULTIPLE_CHOICE_PROMPT' ? "Has value:" : "Has answered:"} size="sm" className="mb-1" />
                              <div className="flex">
                                {prompt.blockType === 'MULTIPLE_CHOICE_PROMPT' && map(conditionPrompt?.options, (option, index) => {
                                  return (
                                    <Badge text={option} key={index} className="mr-1" />
                                  );
                                })}
                                {prompt.blockType === 'INPUT_PROMPT' && (
                                  <div>
                                    <Body body={conditionPrompt?.text} size="sm" className="bg-lm-1 dark:bg-dm-1 p-2 rounded-md" />
                                    <div className="flex items-center mt-2 opacity-40">
                                      <Icon icon="ai" size={12} className="mr-1" />
                                      <Body size="xs" body="This will use AI to check whether this matches the users input" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <FlatButton icon="edit" onClick={() => onEditPromptConditionClicked({ prompt, condition })} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="min-w-10 flex justify-end p-2 bg-dm-2">
                  <FlatButton title="Delete condition" icon="delete" onClick={() => onRemoveConditionClicked(condition._id)} />
                </div>
              </div>
            </Fragment>
          );
        })}
        {value?.length === 0 && (
          <div>
            <Alert type="info" text="If the users prompt answers do not match anything." />
          </div>
        )}
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