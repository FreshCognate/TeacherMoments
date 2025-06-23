import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import map from 'lodash/map';

const FeedbackItemConditions = ({
  conditions
}) => {
  return (
    <div>
      <div>
        {map(conditions, (condition) => {
          console.log(condition);
          return (
            <div>
              Condition one
            </div>
          );
        })}
      </div>
      <FlatButton
        text="Add condition"
      />
    </div>
  );
};

export default FeedbackItemConditions;