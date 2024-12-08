import registerField from '~/core/forms/helpers/registerField';
import Toggle from '~/uikit/toggles/components/toggle';

const FormsFieldToggle = ({ value, schema, updateField }) => {
  return (
    <Toggle
      value={value}
      options={schema.options}
      color={schema.color}
      size={schema.size}
      onClick={(value) => { updateField(value); }}
    />
  );
};

registerField('Toggle', FormsFieldToggle);