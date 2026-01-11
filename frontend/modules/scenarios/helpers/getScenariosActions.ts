import getIsEditor from "~/modules/authentication/helpers/getIsEditor";

export default () => {
  const isEditor = getIsEditor();
  if (isEditor) {
    return [{ action: 'CREATE', text: 'Create scenario', color: 'primary' }]
  }
  return [];
}