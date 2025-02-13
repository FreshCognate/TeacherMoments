import React from 'react';
import Dropzone from 'react-dropzone';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';
import map from 'lodash/map';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';

const AssetSelectorFormField = ({
  accepts,
  maxFiles,
  acceptedFiles,
  isUploading,
  onDrop,
  onDropRejected
}) => {

  return (
    <div>
      {(acceptedFiles.length === 0) && (

        <div className="flex space-x-2  border-2 border-lm-3 dark:border-dm-3 p-2 rounded-lg">
          <Dropzone
            accept={accepts}
            maxFiles={maxFiles}
            multiple={maxFiles !== 1}
            onDrop={onDrop}
            onDropRejected={onDropRejected}>
            {({ getRootProps, getInputProps, isFocused, isDragAccept, isDragReject }) => {
              const className = classnames("flex items-center justify-center cursor-pointer",
                "border border-lm-3 dark:border-dm-3 hover:bg-lm-1 hover:dark:bg-dm-1",
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
            className="flex-col items-center justify-center bg-lm-0 dark:bg-dm-0 hover:bg-lm-1 hover:dark:bg-dm-1 border border-lm-3 dark:border-dm-3 p-2 rounded h-20 w-full"
          />
        </div>
      )}
      {(acceptedFiles.length > 0) && (
        <div className="flex space-x-2  border-2 border-lm-3 dark:border-dm-3 p-2 rounded-lg">
          <div className="flex items-center justify-start bg-lm-0 dark:bg-dm-0  border border-lm-3 dark:border-dm-3 p-2 rounded h-20 w-full">
            {map(acceptedFiles, (acceptedFile) => {
              return (
                <div className="" key={acceptedFile.name}>
                  <div >
                    <img
                      src={acceptedFile.preview}
                      className="aspect-square h-16 bg-lm-1 dark:bg-dm-1 rounded object-cover overflow-hidden"
                      onLoad={() => { URL.revokeObjectURL(acceptedFile.preview) }}
                    />
                  </div>
                </div>
              )
            })}
            <div className="p-2">
              {isUploading && (
                <div>
                  Uploading...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetSelectorFormField;