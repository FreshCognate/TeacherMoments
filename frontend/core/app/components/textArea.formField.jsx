import SlateEditor from '~/core/slate/containers/slateEditorContainer';

const TextArea = ({ value, schema, renderKey, updateField, onLoad }) => {
  return (
    <SlateEditor
      key={renderKey}
      isDisabled={schema.isDisabled}
      shouldAutoFocus={schema.shouldAutoFocus}
      features={schema.features}
      value={value}
      onChange={(value) => updateField(value)}
      onLoad={onLoad}
    />
  );
};

export default TextArea;