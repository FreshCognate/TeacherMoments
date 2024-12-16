import getCache from "~/core/cache/helpers/getCache";

export default async ({ slideRef }) => {

  const tracking = getCache('tracking');

  tracking.set({ activeSlideRef: slideRef });

}