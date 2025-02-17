import createAssetSizes from "../tasks/createAssetSizes.js";
import '../../backend/modules/assets/index.js';

export default async (job) => {
  try {
    console.log(job);
    if (job.name === 'PROCESS_ASSET_SIZES') {
      await createAssetSizes({ assetId: job.data.assetId });
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}