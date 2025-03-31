import getCache from "~/core/cache/helpers/getCache";
import updateTracking from "~/modules/tracking/helpers/updateTracking";
import registerTrigger from "~/modules/triggers/helpers/registerTrigger"
import find from 'lodash/find';
import getBlockByRef from "~/modules/blocks/helpers/getBlockByRef";
import getBlockTracking from "~/modules/tracking/helpers/getBlockTracking";
import getString from "~/modules/ls/helpers/getString";
import updateSlideTracking from "~/modules/tracking/helpers/updateSlideTracking";

registerTrigger('SHOW_FEEDBACK_FROM_PROMPTS', {
  getDescription: (trigger) => {
    return `Show feedback from prompts`;
  },
  trigger: async ({ trigger, context }) => {
    let feedbackItems = [];
    for (const blockRef of trigger.blocks) {

      const block = getBlockByRef({ ref: blockRef });
      const blockTracking = getBlockTracking({ blockRef });

      if (block.blockType === 'MULTIPLE_CHOICE_PROMPT') {

        for (const answerValue of blockTracking.answerValues) {

          const feedbackOption = find(block.options, { value: answerValue });
          const feedbackText = getString({ model: feedbackOption, field: 'feedback' });
          feedbackItems.push(feedbackText);

        }

      }

    }

    updateSlideTracking({ update: { feedbackItems } });

  }
});