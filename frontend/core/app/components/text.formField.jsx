import registerField from '~/core/forms/helpers/registerField';

const TextFormField = ({ value, schema, updateField }) => {
  return (
    <input
      type={schema.textType || 'text'}
      value={value}
      autoFocus={schema.shouldAutoFocus}
      disabled={schema.isDisabled}
      className="border border-lm-3 py-1 px-2 rounded w-full focus:outline-2 outline-primary-regular outline-offset-1"
      onChange={(event) => updateField(event.target.value)}
    />
  );
};

registerField('Text', TextFormField);