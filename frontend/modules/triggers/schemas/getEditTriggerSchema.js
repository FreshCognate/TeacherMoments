import getTriggers from "../helpers/getTriggers";

export default () => {

  const triggers = getTriggers();

  return {
    // action: {
    //   type: 'Select',
    //   label: 'Action:',
    //   isInline: true,
    //   isDisabled: true,
    //   options: triggers
    // }
  }
}