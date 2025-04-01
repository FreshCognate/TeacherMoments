import getCache from "~/core/cache/helpers/getCache";

export default () => {
  const run = getCache('run');
  const preferences = run.data?.preferences || {};
  return preferences;
}