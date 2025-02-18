import React from 'react';
import getAssetUrl from '~/core/app/helpers/getAssetUrl';

const Image = ({
  asset,
  src,
  size = '320',
}) => {

  let imageSrc = src;

  if (asset) {
    imageSrc = getAssetUrl(asset, size);
  }

  console.log(imageSrc);

  return (
    <img
      src={imageSrc}
    />
  );
};

export default Image;