import getCache from "~/core/cache/helpers/getCache";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";

export default (hasGivenConsent) => {
  const run = getCache('run');
  if (isScenarioInPlay()) {
    run.mutate({ isConsentAcknowledged: true, hasGivenConsent }, { method: 'put' });
  } else {
    run.set({ isConsentAcknowledged: true, hasGivenConsent });
  }
}