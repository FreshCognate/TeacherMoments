import getTotalPages from '#core/app/helpers/getTotalPages.js';
import getSearchFromSearchValue from '#core/app/helpers/getSearchFromSearchValue.js';
import getModelPaginationByCurrentPage from '#core/app/helpers/getModelPaginationByCurrentPage.js';

export default async (props, options, context) => {

  const {
    scenarioId,
  } = props;

  let {
    isDeleted = false
  } = options;

  const { models } = context;

  const search = { scenario: scenarioId, isDeleted };

  const blocks = await models.Block.find(search).sort('sortOrder');

  return {
    blocks
  };

};