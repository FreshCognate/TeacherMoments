import getCache from "~/core/cache/helpers/getCache";
import updateTracking from "~/modules/tracking/helpers/updateTracking";
import registerTrigger from "~/modules/triggers/helpers/registerTrigger"

registerTrigger('SHOW_BLOCKS', {
  getDescription: (trigger) => {
    return `Show blocks`;
  },
  trigger: async ({ trigger, context }) => {
    for (const blockRef of trigger.blocks) {
      await updateTracking({
        blockRef,
        update: {
          isHidden: false
        }
      })
    }
  }
});