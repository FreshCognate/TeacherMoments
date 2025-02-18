import React from 'react';
import getAssetUrl from '~/core/app/helpers/getAssetUrl';
import FlatButton from '~/uikit/buttons/components/flatButton';
import includes from 'lodash/includes';

const AssetSelectorDisplayFormField = ({
  asset,
  file,
  isUploading,
  onRemoveAssetClicked
}) => {
  let preview;
  let title;
  let body;
  let hasRemoveButton = false;
  let progress;
  let size = 'original';
  if (asset && asset._id && !isUploading) {
    if (!asset.isUploading) {
      title = asset.name;
      console.log(asset);
      if (asset.hasBeenProcessed) {
        if (includes(asset.sizes, 160)) {
          size = 160;
        }
      }
      preview = getAssetUrl(asset, size);
    }
    hasRemoveButton = true;
  }
  if (file) {
    preview = file.preview;
    title = 'Uploading';
    progress = `${file.progress}%`
  }

  if (!preview) return null;

  return (
    <div className="flex items-center justify-between bg-lm-3/50 dark:bg-dm-3/50 p-2 rounded h-20 w-full">
      <div className="flex items-center">
        <div className="min-w-16">
          <img
            src={preview}
            className="aspect-square w-16 h-16 bg-lm-1 dark:bg-dm-1 rounded object-cover overflow-hidden"
            onLoad={() => {
              if (file) {
                URL.revokeObjectURL(file.preview)
              }
            }}
          />
        </div>
        <div className="p-2 text-black/80 dark:text-white/80">
          <div className="flex flex-col">
            <div className="text-sm  break-all">
              {title}
            </div>
            {isUploading && (
              <div className="flex items-center justify-between">
                <div className="text-xs w-10">
                  {progress}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-2">
        {(hasRemoveButton) && (
          <FlatButton icon="delete" onClick={onRemoveAssetClicked} />
        )}
      </div>
    </div>
  );
};

export default AssetSelectorDisplayFormField;