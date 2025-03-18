import getCache from "~/core/cache/helpers/getCache";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";

export default (hasGivenConsent) => {
  const tracking = getCache('tracking');
  if (isScenarioInPlay()) {
    tracking.mutate({ isConsentAcknowledged: true, hasGivenConsent }, { method: 'put' });
  } else {
    tracking.set({ isConsentAcknowledged: true, hasGivenConsent });
  }
}