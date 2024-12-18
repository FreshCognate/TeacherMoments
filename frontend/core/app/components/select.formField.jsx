import registerField from '~/core/forms/helpers/registerField';
import SelectOptions from '~/uikit/select/components/selectOptions';

const SelectFormField = ({ value, schema, updateField }) => {
  return (
    <SelectOptions
      value={value}
      options={schema.options}
      isDisabled={schema.isDisabled}
      onChange={updateField}
    />
  );
};

registerField('Select', SelectFormField);