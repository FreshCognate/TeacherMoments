import convertAudioToMP3 from '../tasks/convertAudioToMP3.js';
import createAssetSizes from "../tasks/createAssetSizes.js";
import updateAssetToProcessed from '../tasks/updateAssetToProcessed.js';
import '../../backend/modules/assets/index.js';

export default async (job) => {
  try {
    console.log(job);
    if (job.name === 'PROCESS_ASSET_TO_MP3') {
      await convertAudioToMP3({ assetId: job.data.assetId });
    }
    if (job.name === 'PROCESS_ASSET_SIZES') {
      await createAssetSizes({ assetId: job.data.assetId });
    }
    if (job.name === 'PROCESS_ASSET') {
      await updateAssetToProcessed({ assetId: job.data.assetId });
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}