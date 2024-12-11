import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const placeholder = buildLanguageSchema('placeholder', {
  type: 'Text',
  label: 'Placeholder',
  conditions: [{
    type: 'modelValueIs',
    field: 'promptType',
    values: ['TEXT'],
    shouldHideField: true
  }]
});

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Question',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
})

export default {
  promptType: {
    type: 'Toggle',
    label: 'Prompt type',
    size: 'sm',
    options: [{
      value: 'ANSWERS',
      text: 'Answers'
    }, {
      value: 'TEXT',
      text: 'Text'
    }]
  },
  ...body,
  ...placeholder
}