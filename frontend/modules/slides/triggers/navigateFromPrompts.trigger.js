import getCache from "~/core/cache/helpers/getCache";
import updateTracking from "~/modules/tracking/helpers/updateTracking";
import registerTrigger from "~/modules/triggers/helpers/registerTrigger"
import filter from 'lodash/filter';
import handleRequestError from "~/core/app/helpers/handleRequestError";
import getSockets from "~/core/sockets/helpers/getSockets";
import axios from 'axios';
import navigateTo from "~/modules/tracking/helpers/navigateTo";

// registerTrigger('NAVIGATE_FROM_PROMPTS', {
//   getDescription: (trigger) => {
//     return `Navigate from prompts`;
//   },
//   trigger: async ({ trigger, context }) => {
//     for (const blockRef of trigger.blocks) {
//       const contextBlocks = filter(getCache('blocks').data, { ref: blockRef });


//       // workers:generate:generateNavigateFromPrompts
//       // await updateTracking({
//       //   blockRef,
//       //   update: {
//       //     isHidden: false
//       //   }
//       // })
//     }

//     const sockets = await getSockets();

//     sockets.on("workers:generate:generateNavigateFromPrompts", ({ message }) => {
//       if (message._id) {
//         navigateTo({ slideRef: "675f1c9a5f271bd59ff9797f" })
//       }
//     })

//     await axios.post('/api/generate', {
//       "generateType": "NAVIGATE_FROM_PROMPTS",
//       "prompts": [{
//         "stem": "What do you see as the main characteristics of an Engineering Manager?",
//         "answer": "Leadership, helping people achieve their maximum potential"
//       }],
//       "actions": [{
//         "_id": "12345",
//         "context": "the learner is focused more on leadership traits"
//       }, {
//         "_id": "54321",
//         "context": "the learner is focused more on management traits"
//       }]
//     }).then(() => {

//     }).catch(handleRequestError);
//   }
// });