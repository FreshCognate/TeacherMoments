import getCache from "~/core/cache/helpers/getCache";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";

export default () => {
  const tracking = getCache('tracking');
  if (isScenarioInPlay()) {
    tracking.mutate({ isComplete: true }, { method: 'put' });
  } else {
    tracking.set({ isComplete: true });
  }
}