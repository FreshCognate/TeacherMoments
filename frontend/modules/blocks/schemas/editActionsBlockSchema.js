import buildLanguageSchema from '~/core/app/helpers/buildLanguageSchema';

const text = buildLanguageSchema('text', {
  type: 'Text',
  label: 'Text'
})

export default {
  actions: {
    type: 'Array',
    label: 'Actions',
    subSchema: {
      ...text,
    }
  }
}