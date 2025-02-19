import buildLanguagePopulate from '#core/app/helpers/buildLanguagePopulate.js';

export default () => {
  return buildLanguagePopulate({
    path: 'items',
    populate: ['asset']
  });
}