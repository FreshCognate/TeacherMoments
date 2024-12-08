import getCache from '~/core/cache/helpers/getCache';
import registerCondition from '~/core/forms/helpers/registerCondition';

const ls = function ({
  condition,
}) {

  const app = getCache('app');

  if (condition.language !== app.data.language) {
    return {
      hasCondition: true,
      condition: 'Not the correct language',
    };
  }

  return {
    hasCondition: false,
    condition: null,
  };

};

registerCondition('ls', ls);