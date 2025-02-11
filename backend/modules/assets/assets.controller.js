import getAssets from './services/getAssets.js';
import createAsset from './services/createAsset.js';
import getAssetById from './services/getAssetById.js';

export default {

  all: async function ({ query }, context) {

    const { searchValue, currentPage, isDeleted } = query;

    return await getAssets({}, { searchValue, currentPage, isDeleted }, context);

  },

  create: async function ({ body }, context) {

    const { name, assetType } = body;

    const asset = await createAsset({ name, assetType }, {}, context);

    return { asset };

  },

  read: async function ({ param }, context) {

    const asset = await getAssetById({ assetId: param }, {}, context);
    return { asset };

  },

};