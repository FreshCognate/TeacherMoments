import generateShowFeedbackFromPrompts from '../tasks/generateShowFeedbackFromPrompts.js';

export default async (job) => {
  try {
    console.log(job);
    if (job.name === 'SHOW_FEEDBACK_FROM_PROMPTS') {
      await generateShowFeedbackFromPrompts(job.data);
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}