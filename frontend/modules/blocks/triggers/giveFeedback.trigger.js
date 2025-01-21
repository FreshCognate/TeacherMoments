import getCache from "~/core/cache/helpers/getCache";
import updateTracking from "~/modules/tracking/helpers/updateTracking";
import registerTrigger from "~/modules/triggers/helpers/registerTrigger"
import filter from 'lodash/filter';
import handleRequestError from "~/core/app/helpers/handleRequestError";
import getSockets from "~/core/sockets/helpers/getSockets";
import axios from 'axios';
import navigateTo from "~/modules/tracking/helpers/navigateTo";
import getBlockTracking from "~/modules/tracking/helpers/getBlockTracking";
import getBlockByRef from "../helpers/getBlockByRef";
import getString from "~/modules/ls/helpers/getString";

registerTrigger('GIVE_FEEDBACK', {
  getDescription: (trigger) => {
    return `Give feedback`;
  },
  trigger: async ({ trigger, context }) => {
    console.log(trigger, context);

    const blockTracking = getBlockTracking({ blockRef: trigger.elementRef });
    const blocks = getCache('blocks');

    const block = getBlockByRef({ ref: trigger.elementRef });

    // for (const blockRef of trigger.blocks) {
    //   console.log('trigger navigate by prompts');
    //   const contextBlocks = filter(getCache('blocks').data, { ref: blockRef });
    //   console.log(contextBlocks);


    //   // workers:generate:generateNavigateByPrompts
    //   // await updateTracking({
    //   //   blockRef,
    //   //   update: {
    //   //     isHidden: false
    //   //   }
    //   // })
    // }

    const sockets = await getSockets();

    sockets.on("workers:generate:generateGiveFeedback", ({ message }) => {
      if (message._id) {
        console.log('message', message);
      }
    })

    console.log(getString({ model: block, field: "body" }));

    return;

    await axios.post('/api/generate', {
      "generateType": "GIVE_FEEDBACK",
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