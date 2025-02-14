import registerField from '~/core/forms/helpers/registerField';

const TextFormField = ({ value, schema, updateField }) => {
  return (
    <input
      type={schema.textType || 'text'}
      value={value}
      autoFocus={schema.shouldAutoFocus}
      disabled={schema.isDisabled}
      className="py-3 px-3 text-sm text-black/80 dark:text-white/80 bg-lm-0/60 dark:bg-dm-0/30 rounded w-full focus:outline-2 outline-lm-4 dark:outline-dm-4 outline-offset-2"
      onChange={(event) => updateField(event.target.value)}
    />
  );
};

registerField('Text', TextFormField);