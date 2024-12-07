import React from 'react';
import map from 'lodash/map';
import uniqueId from 'lodash/uniqueId';

import Title from '~/uikit/content/components/title';
import FormField from './formField';

const Form = ({
  title,
  model = {},
  schema,
  form,
  state,
  renderKey,
  size = 'sm',
  onUpdateField,
}) => {

  function renderTitle() {
    return <Title title={title} className="text-3xl font-bold" />;
  }

  function renderFields() {
    return map(schema, (schemaValue, schemaKey) => {

      const { type, label, help, isInline, getMediaQueriesInfo, formFieldId } = schemaValue;
      const fieldId = `${uniqueId('form-field-')}-${type.toLowerCase()}`;
      const value = model[schemaKey];
      const fieldState = state[schemaKey];

      if (!fieldState || fieldState.shouldHideField) return null;

      return (
        <FormField
          model={model}
          key={schemaKey}
          renderKey={renderKey}
          value={value}
          type={type}
          label={label}
          help={help}
          isInline={isInline}
          getMediaQueriesInfo={getMediaQueriesInfo}
          form={form}
          fieldId={fieldId}
          fieldKey={schemaKey}
          formFieldId={formFieldId}
          size={size}
          isDirty={fieldState.isDirty}
          hasError={fieldState.hasError}
          error={fieldState.error}
          hasCondition={fieldState.hasCondition}
          condition={fieldState.condition}
          schema={schemaValue}
          onUpdateField={onUpdateField}
        />
      );
    });
  }

  return (
    <div>
      {renderTitle()}
      {renderFields()}
    </div>
  );
};

export default React.memo(Form);
