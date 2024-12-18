import getCache from "~/core/cache/helpers/getCache";
import updateTracking from "~/modules/tracking/helpers/updateTracking";
import registerTrigger from "~/modules/triggers/helpers/registerTrigger"

registerTrigger('HIDE_BLOCKS', {
  getDescription: (trigger) => {
    return `Hide blocks`;
  },
  trigger: async ({ trigger, context }) => {
    for (const blockRef of trigger.blocks) {
      await updateTracking({
        blockRef,
        update: {
          isHidden: true
        }
      })
    }
  }
});