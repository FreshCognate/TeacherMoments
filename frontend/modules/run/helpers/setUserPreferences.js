import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import extend from 'lodash/extend';

export default (preferences) => {
  const run = getCache('run');
  const clonedPreferences = cloneDeep(run.data.preferences || {});
  extend(clonedPreferences, preferences);
  run.set({ preferences: clonedPreferences });
}