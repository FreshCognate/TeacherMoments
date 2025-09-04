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

        const stem = "How well do you know the subject of a growth mindset?"
        const usersAnswer = "A growth mindset is all about being open to challenges and changes and understanding that your mind can grow. Putting a simple 'I can't do this...yet' is a great way to understand it. The 'yet' being that I can't do it know but I can get to it if I try!"

        const conditions = [{
          "_id": "1",
          "condition": "Choose this condition if the user really explains that a growth mindset is all about the belief that one's abilities, intelligence, and talents can be developed through dedication, hard work, and perseverance, rather than being fixed or innate traits. This perspective allows individuals to embrace challenges, view setbacks and criticism as opportunities for learning, and maintain motivation in the face of obstacles."
        }, {
          "_id": "2",
          "condition": "Choose this condition if the user does not know anything about a growth mindset"
        }, {
          "_id": "3",
          "condition": "Choose this condition if the user knows the basics and mentions about being open to challenges."
        }];
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