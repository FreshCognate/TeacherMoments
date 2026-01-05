import getCache from "~/core/cache/helpers/getCache"

export default () => {
  const authentication = getCache('authentication');
  const { role } = authentication.data;
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return [{ action: 'CREATE', text: 'Create cohort', color: 'primary' }]
  }
  return [];
}