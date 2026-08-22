import registerCondition from '~/core/forms/helpers/registerCondition';
import getConditionlessStems from './getConditionlessStems';

const hasConditionlessStem = function ({ model, condition }) {

  const conditionlessStems = getConditionlessStems({ trigger: model });

  if (conditionlessStems.length > 0) {
    return {
      hasCondition: true,
      condition
    };
  }

  return {
    hasCondition: false,
    condition: null
  };

};

registerCondition('hasConditionlessStem', hasConditionlessStem);
