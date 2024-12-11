import buildLanguageSchema from '~/core/app/helpers/buildLanguageSchema';
import '../containers/actions.formFieldContainer';
const text = buildLanguageSchema('text', {
  type: 'Text',
  label: 'Text'
})

export default {
  actions: {
    type: 'Actions',
    label: 'Actions',
    subSchema: {
      ...text,
    }
  }
}