import registerField from '~/core/forms/helpers/registerField';

const TextFormField = ({ value, schema, updateField }) => {
  return (
    <input
      type={schema.textType || 'text'}
      value={value}
      autoFocus={schema.shouldAutoFocus}
      disabled={schema.isDisabled}
      className="border border-lm-3 py-1 px-2 bg-lm-1 dark:bg-dm-1 dark:border-dm-3 rounded w-full focus:outline-2 outline-primary-regular dark:outline-primary-light outline-offset-1"
      onChange={(event) => updateField(event.target.value)}
    />
  );
};

registerField('Text', TextFormField);