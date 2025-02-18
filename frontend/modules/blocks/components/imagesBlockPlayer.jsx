import React from 'react';
import getContent from '~/modules/ls/helpers/getContent';
import map from 'lodash/map';
import Image from '~/uikit/content/components/image';
import classnames from 'classnames';

const ImagesBlockPlayer = ({
  items,
  imagesShape,
  imagesBorderRadius
}) => {
  let imageSize = 640;
  if (items.length > 1) {
    imageSize = 320;
  }
  return (
    <div className={classnames("grid gap-4", {
      "grid-cols-1": items.length === 1,
      "grid-cols-2": items.length === 2,
      "grid-cols-3": items.length > 2
    })}>
      {map(items, (item) => {
        return (
          <div key={item._id}>
            <Image
              asset={getContent({ model: item, field: 'asset' })}
              size={imageSize}
              shape={imagesShape}
              borderRadius={imagesBorderRadius}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ImagesBlockPlayer;