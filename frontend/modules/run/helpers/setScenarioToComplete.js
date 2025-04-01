import getCache from "~/core/cache/helpers/getCache";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";

export default () => {
  const run = getCache('run');
  if (isScenarioInPlay()) {
    run.mutate({ isComplete: true }, { method: 'put' });
  } else {
    run.set({ isComplete: true });
  }
}