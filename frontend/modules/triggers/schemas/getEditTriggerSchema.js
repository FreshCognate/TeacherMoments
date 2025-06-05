import getTriggers from "../helpers/getTriggers";

export default (isEditing) => {

  const triggers = getTriggers();

  return {
    action: {
      type: 'Select',
      label: 'Action:',
      isInline: true,
      isDisabled: isEditing,
      options: triggers
    }
  }
}