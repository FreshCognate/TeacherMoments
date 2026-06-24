import withConnection from '../../backend/core/databases/helpers/withConnection.js';

export default async ({ assetId }) => withConnection(async (connection) => {

  const { models } = connection;
  await models.Asset.findByIdAndUpdate(assetId, { hasBeenProcessed: true, isProcessing: false, processedAt: new Date() });

});
