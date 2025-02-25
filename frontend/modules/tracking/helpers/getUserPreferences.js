import getCache from "~/core/cache/helpers/getCache";

export default () => {
  const tracking = getCache('tracking');
  const preferences = tracking.data.preferences || {};
  return preferences;
}