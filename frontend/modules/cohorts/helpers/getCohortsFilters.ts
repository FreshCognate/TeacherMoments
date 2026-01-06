import getCache from "~/core/cache/helpers/getCache"
import getIsEditor from "~/modules/authentication/helpers/getIsEditor";

export default () => {
  const isEditor = getIsEditor();
  if (isEditor) {
    return [{ value: false, text: 'Live' }, { value: true, text: 'Archived' }]
  }
  return [];
}