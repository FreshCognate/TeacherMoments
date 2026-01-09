import getCache from "~/core/cache/helpers/getCache";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";

export default () => {
  const run = getCache('run');
  if (isScenarioInPlay()) {
    run.mutate({ isArchived: true }, { method: 'put' });
  } else {
    run.set({ isArchived: true });
  }
}