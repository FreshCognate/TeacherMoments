import createJob from "#core/queues/helpers/createJob.js";

export default async (props, options, context) => {

  const { assetId } = props;

  const { models } = context;

  const asset = await models.Asset.findByIdAndUpdate(assetId, { isUploading: false, isProcessing: true }, { new: true });

  if (!asset) throw { message: 'This asset does not exist', statusCode: 404 };

  createJob({
    queue: 'assets',
    name: 'PROCESS_ASSET',
    job: {
      assetId: asset._id
    },
    children: [{
      queue: 'assets',
      name: 'PROCESS_ASSET_TRANSCRIPT',
      job: {
        assetId: asset._id
      }
    }, {
      queue: 'assets',
      name: 'PROCESS_ASSET_SIZES',
      job: {
        assetId: asset._id
      }
    }, {
      queue: 'assets',
      name: 'PROCESS_ASSET_ARIA_LABEL',
      job: {
        assetId: asset._id
      }
    }]
  });

  return asset;

};