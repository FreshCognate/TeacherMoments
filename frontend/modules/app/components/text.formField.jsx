import registerField from '~/core/forms/helpers/registerField';

const TextFormField = ({ value, schema, updateField }) => {
  return (
    <input
      type={schema.textType || 'text'}
      value={value}
      autoFocus={schema.shouldAutoFocus}
      disabled={schema.isDisabled}
      onChange={(event) => updateField(event.target.value)}
    />
  );
};

registerField('Text', TextFormField);