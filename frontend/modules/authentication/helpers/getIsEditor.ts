import getCache from "~/core/cache/helpers/getCache";

export default () => {
  const authentication = getCache('authentication');
  const role = authentication?.data?.role;
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}