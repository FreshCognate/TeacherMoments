import getCache from "~/core/cache/helpers/getCache"
import getIsEditor from "~/modules/authentication/helpers/getIsEditor";

export default () => {
  const isEditor = getIsEditor();
  if (isEditor) {
    return [{ action: 'CREATE', text: 'Create cohort', color: 'primary' }]
  }
  return [];
}