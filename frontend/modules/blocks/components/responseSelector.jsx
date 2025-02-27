import React from 'react';
import Alert from '~/uikit/alerts/components/alert';
import map from 'lodash/map';
import Icon from '~/uikit/icons/components/icon';
import Body from '~/uikit/content/components/body';

const ResponseSelector = ({
  hasError,
  error,
  responses,
  value,
  onResponseClicked
}) => {
  return (
    <div>
      {(hasError) && (
        <Alert type="warning" text={error} />
      )}
      {(!hasError) && (
        map(responses, (response) => {
          return (
            <label key={response.blockRef} className="cursor-pointer flex items-center bg-lm-3/60 dark:bg-dm-3/30 p-2 rounded-lg mb-2">
              <div className="mr-4">
                <input type='radio' checked={value === response.blockRef} className=" accent-primary-regular dark:accent-primary-light disabled:accent-primary-regular dark:disabled:accent-primary-light" onChange={() => onResponseClicked(response.blockRef)} />
              </div>
              <div className="w-full text-xs ">
                <div className="flex items-center mb-2">
                  <div className="w-1/3">Slide name</div>
                  <div className="">{response.slideName}</div>
                </div>
                <div className="flex items-center mb-2">
                  <div className="text-xs w-1/3">Block type</div>
                  <div className="">{response.blockDisplayName}</div>
                </div>
                <div className="flex items-center">
                  <div className="text-xs w-1/3">Prompt</div>
                  <div className="">
                    <Body body={response.blockPrompt} />
                  </div>
                </div>
              </div>
            </label>
          )
        })
      )}
    </div>
  );
};

export default ResponseSelector;