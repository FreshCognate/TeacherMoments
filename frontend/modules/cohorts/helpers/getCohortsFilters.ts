import getCache from "~/core/cache/helpers/getCache"

export default () => {
  const authentication = getCache('authentication');
  const { role } = authentication.data;
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return [{ value: false, text: 'Live' }, { value: true, text: 'Archived' }]
  }
  return [];
}