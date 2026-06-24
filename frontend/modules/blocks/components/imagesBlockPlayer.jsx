import React from 'react';
import { AnimatePresence } from 'framer-motion';
import getContent from '~/modules/ls/helpers/getContent';
import map from 'lodash/map';
import Image from '~/uikit/content/components/image';
import ImageZoomOverlay from './imageZoomOverlay';
import classnames from 'classnames';

const ImagesBlockPlayer = ({
  items,
  imagesShape,
  imagesBorderRadius,
  canClickToZoom,
  zoomedItem,
  onImageClicked,
  onZoomClosed
}) => {
  let imageSize = 640;
  if (items.length > 1) {
    imageSize = 320;
  }

  const zoomedAsset = zoomedItem ? getContent({ model: zoomedItem, field: 'asset' }) : null;

  return (
    <div className={classnames("grid gap-4", {
      "grid-cols-1": items.length === 1,
      "grid-cols-2": items.length === 2,
      "grid-cols-3": items.length > 2
    })}>
      {map(items, (item) => {
        const asset = getContent({ model: item, field: 'asset' });
        if (asset && asset._id) {
          console.log(asset);
          const image = (
            <Image
              asset={asset}
              size={imageSize}
              shape={imagesShape}
              borderRadius={imagesBorderRadius}
            />
          );
          if (canClickToZoom) {
            return (
              <button
                key={item._id}
                type="button"
                className="cursor-zoom-in"
                onClick={() => onImageClicked(item)}
              >
                {image}
              </button>
            );
          }
          return (
            <div key={item._id}>
              {image}
            </div>
          );
        }
      })}
      <AnimatePresence>
        {zoomedAsset && (
          <ImageZoomOverlay
            asset={zoomedAsset}
            shape={imagesShape}
            borderRadius={imagesBorderRadius}
            onClose={onZoomClosed}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImagesBlockPlayer;
