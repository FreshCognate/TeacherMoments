import buildLanguageSchema from '~/core/app/helpers/buildLanguageSchema';
import '~/modules/slides/containers/slideRefSelectorContainer.formField';

const text = buildLanguageSchema('text', {
  type: 'Text',
  label: 'Text'
})

export default {
  contentSchema: {
    actions: {
      type: 'Array',
      label: 'Actions',
      deleteTitleText: "Delete action",
      addButtonText: "Add another action",
      shouldStopLastItemDelete: true,
      subSchema: {
        ...text,
        actionType: {
          type: 'Select',
          label: 'On click',
          options: [{
            value: 'COMPLETE_SLIDE',
            text: 'complete slide'
          }, {
            value: 'RESET_SCENARIO',
            text: 'Reset scenario'
          }]
        }
      }
    }
  },
  settingsSchema: {
    name: {
      type: 'Text',
      label: 'Name',
      help: 'An optional name to help identify this block in analytics.'
    }
  }
}