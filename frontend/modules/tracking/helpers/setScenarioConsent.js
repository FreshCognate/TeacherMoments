import getCache from "~/core/cache/helpers/getCache";

export default (hasGivenConsent) => {
  const tracking = getCache('tracking');
  tracking.set({ isConsentAcknowledged: true, hasGivenConsent });
}