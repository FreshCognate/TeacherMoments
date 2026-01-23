import getCache from "~/core/cache/helpers/getCache";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";

export default () => {
  const run = getCache('run');
  if (isScenarioInPlay()) {
    return new Promise((resolve) => {
      run.mutate({ isArchived: true }, { method: 'put' }, () => {
        resolve();
      });
    })
  } else {
    return run.set({ isArchived: true });
  }
}