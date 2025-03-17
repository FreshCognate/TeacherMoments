import getCache from "~/core/cache/helpers/getCache";

export default () => {
  const tracking = getCache('tracking');
  tracking.set({ isComplete: true });
}