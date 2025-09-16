import generateShowFeedbackFromPrompts from '../tasks/generateShowFeedbackFromPrompts.js';
import generateMatchUserFeedbackToConditions from '../tasks/generateMatchUserFeedbackToConditions.js';
import getSockets from '../getSockets.js';

export default async (job) => {
  try {
    let sockets;

    switch (job.name) {
      case 'SHOW_FEEDBACK_FROM_PROMPTS': {
        //await generateShowFeedbackFromPrompts(job.data);
        break;
      }
      case 'USER_INPUT_PROMPT_MATCHES_CONDITION_PROMPT': {
        sockets = await getSockets();

        sockets.emit(`workers:generate:${job.id}`, {
          event: 'GENERATING'
        });

        const { stem, usersAnswer, conditions } = job.data.payload;

        const payload = await generateMatchUserFeedbackToConditions({ stem, usersAnswer, conditions });

        sockets = await getSockets();

        sockets.emit(`workers:generate:${job.id}`, {
          event: 'GENERATED',
          payload
        });
        break;
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}