import React from 'react';
import getAssetUrl from '~/core/app/helpers/getAssetUrl';
import FlatButton from '~/uikit/buttons/components/flatButton';

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
  if (asset && asset._id) {
    if (!asset.isUploading) {
      //title = asset.name;
      preview = getAssetUrl(asset, 'original');
    }
    hasRemoveButton = true;
  }
  if (file) {
    preview = file.preview;
    title = 'Uploading';
    progress = `${file.progress}%`
  }
  return (
    <div className="flex items-center justify-start bg-lm-3/50 dark:bg-dm-3/50 p-2 rounded h-20 w-full">
      <div >
        <img
          src={preview}
          className="aspect-square h-16 bg-lm-1 dark:bg-dm-1 rounded object-cover overflow-hidden"
          onLoad={() => {
            if (file) {
              URL.revokeObjectURL(file.preview)
            }
          }}
        />
      </div>
      <div className="p-2 text-black/80 dark:text-white/80">
        <div className="flex flex-col ">
          <div>
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
      {(hasRemoveButton) && (
        <div>
          <FlatButton icon="delete" onClick={onRemoveAssetClicked} />
        </div>
      )}
    </div>
  );
};

export default AssetSelectorDisplayFormField;