import React from 'react';
import getAssetUrl from '~/core/app/helpers/getAssetUrl';
import classnames from 'classnames';

const Image = ({
  asset,
  src,
  size = '320',
  shape,
  borderRadius,
}) => {

  let imageSrc = src;

  if (asset) {
    imageSrc = getAssetUrl(asset, size);
  }

  const className = classnames("object-cover", {
    "aspect-square rounded-full": shape === 'CIRCLE',
    "aspect-[3/2]": shape === 'LANDSCAPE',
    "aspect-[2/3]": shape === 'PORTRAIT',
    "aspect-square": shape === 'SQUARE',
    "rounded-[8px]": borderRadius === 8 && shape !== 'CIRCLE'
  });

  return (
    <img
      src={imageSrc}
      className={className}
    />
  );
};

export default Image;