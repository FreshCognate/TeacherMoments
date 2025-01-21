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

const answerText = buildLanguageSchema('text', {
  type: 'Text',
  label: 'Text'
})

const feedbackText = buildLanguageSchema('text', {
  type: 'Text',
  label: 'Text'
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
  ...placeholder,
  isMultiSelect: {
    type: 'Toggle',
    label: 'Mutliple answers can be selected',
    size: 'sm',
    conditions: [{
      type: 'modelValueIs',
      field: 'promptType',
      values: ['ANSWERS'],
      shouldHideField: true
    }],
    options: [{
      value: false,
      text: 'No'
    }, {
      value: true,
      text: 'Yes'
    }]
  },
  items: {
    type: 'Array',
    label: 'Answers',
    conditions: [{
      type: 'modelValueIs',
      field: 'promptType',
      values: ['ANSWERS'],
      shouldHideField: true
    }],
    subSchema: {
      ...answerText,
      value: {
        type: 'Text',
        label: 'Value'
      }
    }
  },
  feedbackItems: {
    type: 'Array',
    label: 'Feedback',
    conditions: [{
      type: 'modelValueIs',
      field: 'promptType',
      values: ['ANSWERS'],
      shouldHideField: true
    }],
    subSchema: {
      ...feedbackText,
      value: {
        type: 'Text',
        label: 'Value'
      }
    }
  }
}