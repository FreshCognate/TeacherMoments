import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import extend from 'lodash/extend';

export default (preferences) => {
  const tracking = getCache('tracking');
  const clonedPreferences = cloneDeep(tracking.data.preferences || {});
  extend(clonedPreferences, preferences);
  tracking.set({ preferences: clonedPreferences });
}