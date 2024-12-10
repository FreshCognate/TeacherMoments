import includes from 'lodash/includes';
import registerCondition from '~/core/forms/helpers/registerCondition';
import get from 'lodash/get';

const modelValueIs = function ({
  model,
  condition,
}) {

  if (includes(condition.values, get(model, condition.field))) {

    return {
      hasCondition: false,
      condition: null
    };
  }

  return {
    hasCondition: true,
    condition,
  };

};

registerCondition('modelValueIs', modelValueIs);