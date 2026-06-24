import isEqual from 'lodash/isEqual.js';
import sortBy from 'lodash/sortBy.js';
import '../../backend/modules/assets/index.js';
import withConnection from '../../backend/core/databases/helpers/withConnection.js';
import getAvailableImageSizes, { SIZES } from '../helpers/getAvailableImageSizes.js';
import createAssetSizes from '../tasks/createAssetSizes.js';

const hasExpectedSizes = (asset, expectedSizes) => {
  const currentSizes = asset.sizes || [];
  return isEqual(sortBy(currentSizes), sortBy(expectedSizes));
};

export default async () => withConnection(async (connection) => {

  const { models } = connection;

  // The old `width > size` check only ever skipped a rendition when the original
  // width was exactly a SIZES boundary (e.g. a 320px image lost its 320px rendition
  // and was served at 160px). Those boundary-width images are the only ones affected.
  const assets = await models.Asset.find({ fileType: 'image', width: { $in: SIZES } });

  console.log(`Found ${assets.length} boundary-width image assets to check`);

  let regenerated = 0;
  let skipped = 0;
  let failed = 0;

  for (const asset of assets) {
    const expectedSizes = getAvailableImageSizes(asset.width);

    if (hasExpectedSizes(asset, expectedSizes)) {
      skipped++;
      continue;
    }

    try {
      await createAssetSizes({ assetId: asset._id });
      regenerated++;
      console.log(`Asset ${asset._id} (${asset.width}px) — regenerated ${JSON.stringify(asset.sizes)} → ${JSON.stringify(expectedSizes)}`);
    } catch (error) {
      failed++;
      console.log(`Asset ${asset._id} (${asset.width}px) — FAILED: ${error.message}`);
    }
  }

  console.log(`Upgrade complete — regenerated: ${regenerated}, skipped (already correct): ${skipped}, failed: ${failed}`);

});
