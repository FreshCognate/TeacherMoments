import buildLanguagePopulate from '#core/app/helpers/buildLanguagePopulate.js';

export default () => {
  const blockPopulate = buildLanguagePopulate(
    {
      path: 'items',
      populate: ['asset']
    }
  );
  return blockPopulate;
}