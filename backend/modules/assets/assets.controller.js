import createAsset from './services/createAsset.js';

export default {

  create: async function ({ body }, context) {

    const { name, assetType } = body;

    const asset = await createAsset({ name, assetType }, {}, context);

    return { asset };

  }

};