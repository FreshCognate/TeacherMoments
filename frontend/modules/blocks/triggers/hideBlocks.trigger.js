import registerTrigger from "~/modules/triggers/helpers/registerTrigger"

registerTrigger('HIDE_BLOCKS', {
  getDescription: (trigger) => {
    return `Hide blocks`;
  },
  trigger: ({ trigger, context }) => {
    console.log('triggering', trigger, context);
  }
});