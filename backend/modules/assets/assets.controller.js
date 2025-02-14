import getAssets from './services/getAssets.js';
import createAsset from './services/createAsset.js';
import getAssetById from './services/getAssetById.js';
import restoreAssetById from './services/restoreAssetById.js';
import updateAssetById from './services/updateAssetById.js';
import deleteAssetById from './services/deleteAssetById.js';
import has from 'lodash/has.js';

export default {

  all: async function ({ query }, context) {

    const { searchValue, currentPage, isDeleted } = query;

    return await getAssets({}, { searchValue, currentPage, isDeleted }, context);

  },

  create: async function ({ body }, context) {

    const { name, mimetype } = body;

    const { asset, signedUrl } = await createAsset({ name, mimetype }, {}, context);

    return { asset, signedUrl };

  },

  read: async function ({ param }, context) {

    const asset = await getAssetById({ assetId: param }, {}, context);
    return { asset };

  },

  update: async function ({ param, body }, context) {

    if (has(body, 'isDeleted')) {
      const asset = await restoreAssetById({ assetId: param }, {}, context);
      return { asset };
    }

    const asset = await updateAssetById({ assetId: param, update: body }, {}, context);

    return { asset };

  },

  delete: async function ({ param }, context) {
    const asset = await deleteAssetById({ assetId: param }, {}, context);

    return { asset };
  }

};