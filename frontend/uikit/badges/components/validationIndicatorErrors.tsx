import React from 'react';
import map from 'lodash/map';
import { ValidationError } from './validationIndicator';

const ELEMENT_TYPE_MAPPINGS: Record<string, string> = {
  BLOCK: 'Block',
  SLIDE: 'Slide',
  TRIGGER: 'Trigger'
}

const ValidationIndicatorErrors = ({
  errors,
  onErrorClicked
}: {
  errors: ValidationError[],
  onErrorClicked: (error: ValidationError) => void
}) => {

  return (
    <div>
      {map(errors, (error, index) => {
        return (
          <div key={index} className="p-2 m-2 rounded-md bg-lm-0 hover:bg-lm-0 dark:bg-dm-0 hover:dark:bg-dm-1 cursor-pointer" onClick={() => onErrorClicked(error)}>
            <div className="text-black/80 dark:text-white/80">
              {error.message}
            </div>
            <div className="text-black/60 dark:text-white/60 text-xs">
              {`Element: ${ELEMENT_TYPE_MAPPINGS[error.elementType]}`}
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default ValidationIndicatorErrors;