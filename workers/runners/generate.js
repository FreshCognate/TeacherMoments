import generateGiveFeedbackFromPrompts from '../tasks/generateGiveFeedbackFromPrompts.js';
import generateNavigateFromPrompts from '../tasks/generateNavigateFromPrompts.js';

export default async (job) => {
  try {
    console.log(job);
    if (job.name === 'NAVIGATE_FROM_PROMPTS') {
      await generateNavigateFromPrompts({
        prompts: job.data.prompts,
        actions: job.data.actions,
      });
    }
    if (job.name === 'GIVE_FEEDBACK_FROM_PROMPTS') {
      await generateGiveFeedbackFromPrompts(job.data);
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}