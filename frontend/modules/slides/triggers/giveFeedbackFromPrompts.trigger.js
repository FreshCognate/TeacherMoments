import getCache from "~/core/cache/helpers/getCache";
import registerTrigger from "~/modules/triggers/helpers/registerTrigger"
import handleRequestError from "~/core/app/helpers/handleRequestError";
import getSockets from "~/core/sockets/helpers/getSockets";
import axios from 'axios';
import getBlockTracking from "~/modules/tracking/helpers/getBlockTracking";
import getString from "~/modules/ls/helpers/getString";
import getBlockByRef from "~/modules/blocks/helpers/getBlockByRef";

registerTrigger('GIVE_FEEDBACK_FROM_PROMPTS', {
  getDescription: (trigger) => {
    return `Give feedback from prompts`;
  },
  trigger: async ({ trigger, context }) => {
    console.log(trigger, context);

    const blockTracking = getBlockTracking({ blockRef: trigger.elementRef });
    const blocks = getCache('blocks');

    const block = getBlockByRef({ ref: trigger.elementRef });

    const sockets = await getSockets();

    sockets.on("workers:generate:generateGiveFeedbackFromPrompts", ({ message }) => {
      if (message._id) {
        console.log('message', message);
      }
    })

    console.log(getString({ model: block, field: "body" }));

    return;

    await axios.post('/api/generate', {
      "generateType": "GIVE_FEEDBACK_FROM_PROMPTS",
      "stem": getString({ model: block, field: "body" }),
      "answerText": "Red pill",
      "answerValue": "Red Pill",
      "feedbackItems": [{
        "_id": "0",
        "text": "I prefer running with the simulation",
        "value": "Red Pill"
      }, {
        "_id": "1",
        "text": "I prefer normality",
        "value": "Blue Pill"
      }],
    }).then(() => {

    }).catch(handleRequestError);
  }
});