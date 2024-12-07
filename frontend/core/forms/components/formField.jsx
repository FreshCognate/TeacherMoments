import React from 'react';

import FormFieldCondition from './formFieldCondition';
import FormFieldLabel from './formFieldLabel';
import FormFieldHelp from './formFieldHelp';
import FormFieldError from './formFieldError';
import getField from '../helpers/getField';
import classnames from 'classnames';
import FlatButton from '~/uikit/buttons/components/flatButton';
import getCache from '~/core/cache/helpers/getCache';

const FormField = ({
  model,
  type,
  value = null,
  label = '',
  help = '',
  isInline,
  getMediaQueriesInfo,
  fieldId = '',
  fieldKey,
  size,
  form,
  schema,
  condition = {},
  error,
  renderKey,
  isDirty,
  hasCondition = false,
  hasError,
  formFieldId,
  onUpdateField,
}) => {

  const FormFieldComponent = getField(type);

  if (!FormFieldComponent) {
    console.warn(`You're trying to render a form field (${type}) that has not been registered. Look at the schema for ${fieldKey}`);
    return null;
  }

  function updateField(update, callback) {
    const updateObject = {};
    updateObject[fieldKey] = update;
    return onUpdateField({
      update: updateObject,
      callback
    });
  }

  function updateFields(updateObject, callback) {
    return onUpdateField({
      update: updateObject,
      callback
    });
  }

  const className = classnames('relative mb-4 group', {
    'flex items-center justify-between': isInline
  });

  let mediaQueriesInfo = null;
  let isMediaStateSelected = false;

  if (getMediaQueriesInfo) {
    const editorData = getCache('editor').data || getCache('themeEditor').data;
    const { colorState, screenState, elementState } = editorData;
    if (colorState !== 'light' || screenState !== 'lg' || elementState !== "") {
      isMediaStateSelected = true;
      mediaQueriesInfo = getMediaQueriesInfo({ model, fieldKey, value, schema });
    }
  }

  return (
    <div className={className} id={formFieldId}>
      {(mediaQueriesInfo && mediaQueriesInfo.hasValue && isMediaStateSelected) && (
        <FlatButton
          icon="delete"
          size={16}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
          onClick={() => updateFields(mediaQueriesInfo.resetData)
          } />
      )}
      {(mediaQueriesInfo && !mediaQueriesInfo.hasValue && isMediaStateSelected) && (
        <FlatButton
          icon="add"
          size={16}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
          onClick={() => updateFields(mediaQueriesInfo.initialData)
          } />
      )}
      <FormFieldLabel
        label={label}
        fieldId={fieldId}
        size={size}
        isInline={isInline}
      />
      {(!hasCondition) && (
        <>
          <FormFieldHelp
            help={help}
            size={size}
          />
          {(!mediaQueriesInfo || (mediaQueriesInfo && mediaQueriesInfo.hasValue)) && (
            <div>
              <FormFieldComponent
                model={model}
                schema={schema}
                value={value}
                fieldKey={fieldKey}
                fieldId={fieldId}
                form={form}
                renderKey={renderKey}
                updateField={updateField}
                updateFields={updateFields}
              />
            </div>
          )}
          <FormFieldError hasError={isDirty && hasError} error={error} />
        </>
      )}
      <FormFieldCondition
        hasCondition={hasCondition}
        condition={condition}
      />
    </div>
  );
};

export default React.memo(FormField);
