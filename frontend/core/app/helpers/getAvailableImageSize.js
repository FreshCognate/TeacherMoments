import each from 'lodash/each';
import reverse from 'lodash/reverse';

export default ({ asset, size }) => {
  if (asset && asset.fileType === 'image' && asset.extension === 'gif') {
    return 'original';
  }
  if (size && asset && asset.sizes) {
    let responsiveSize = null;
    const assetSizes = asset.sizes.slice();
    each(reverse(assetSizes), (sizeItem) => {
      if (sizeItem >= size) {
        responsiveSize = sizeItem;
      }
    });

    if (asset.sizes.length) {
      if (!responsiveSize) responsiveSize = asset.sizes[asset.sizes.length - 1];
    }

    if (!responsiveSize) return "original";

    return responsiveSize;
  }
  return "original";
}