import createGenerate from './services/createGenerate.js';
import has from 'lodash/has.js';

export default {

  create: async function ({ body }, context) {

    const { generateType, prompts, actions, stem, answerText, answerValue, feedbackItems } = body;

    const generate = await createGenerate({ generateType, prompts, actions, stem, answerText, answerValue, feedbackItems }, {}, context);

    return { generate }

  },

};