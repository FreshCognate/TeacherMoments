import generateGiveFeedback from '../tasks/generateGiveFeedback.js';
import generateNavigateByPrompts from '../tasks/generateNavigateByPrompts.js';

export default async (job) => {
  try {
    console.log(job);
    if (job.name === 'NAVIGATE_BY_PROMPTS') {
      await generateNavigateByPrompts({
        prompts: job.data.prompts,
        actions: job.data.actions,
      });
    }
    if (job.name === 'GIVE_FEEDBACK') {
      await generateGiveFeedback(job.data);
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}