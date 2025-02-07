import getCache from "~/core/cache/helpers/getCache"

export default (userId) => {
  const authentication = getCache('authentication');
  if (userId === authentication.data._id) {
    return true;
  }
  return false;
}