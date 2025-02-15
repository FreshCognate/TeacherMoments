import React from 'react';
import Dropzone from 'react-dropzone';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';
import map from 'lodash/map';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';
import AssetSelectorDisplayFormField from './assetSelectorDisplay.formField';

const AssetSelectorFormField = ({
  value,
  accepts,
  maxFiles,
  acceptedFiles,
  isUploading,
  onDrop,
  onDropRejected,
  onRemoveAssetClicked
}) => {

  return (
    <div>
      {(value && value._id) && (
        <AssetSelectorDisplayFormField
          asset={value}
          isUploading={isUploading}
          onRemoveAssetClicked={onRemoveAssetClicked}
        />
      )}
      {(acceptedFiles.length === 0 && !value) && (

        <div className="flex space-x-2">
          <Dropzone
            accept={accepts}
            maxFiles={maxFiles}
            multiple={maxFiles !== 1}
            onDrop={onDrop}
            onDropRejected={onDropRejected}>
            {({ getRootProps, getInputProps, isFocused, isDragAccept, isDragReject }) => {
              const className = classnames("flex items-center justify-center cursor-pointer",
                "bg-lm-3/60 dark:bg-dm-3/50",
                "p2 rounded h-20 w-full",
                "text-black dark:text-white text-opacity-60 dark:text-opacity-60",
                "hover:text-opacity-100 hover:dark:text-opacity-100",
                {
                  "border-primary-regular dark:border-primary-light": isDragAccept,
                  "border-lm-4 dark:border-dm-4": isFocused
                })
              return (
                <div
                  {...getRootProps()}
                  className={className}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center">
                    <Icon icon="upload" size={24} />
                    <Body body="Drop to upload" size='sm' />
                  </div>
                </div>
              );
            }}
          </Dropzone>
          <FlatButton
            text="Choose existing file"
            icon="select"
            iconSize={24}
            isDisabled
            className="flex-col items-center justify-center bg-lm-3/60 dark:bg-dm-3/50 p-2 rounded h-20 w-full"
          />
        </div>
      )}
      {(acceptedFiles.length > 0 && isUploading) && (
        <div className="flex">
          {map(acceptedFiles, (acceptedFile) => {
            return (
              <AssetSelectorDisplayFormField
                key={acceptedFile.name}
                file={acceptedFile}
                isUploading={isUploading}
              />
            )
          })}
        </div>
      )}
    </div>
  );
};

export default AssetSelectorFormField;