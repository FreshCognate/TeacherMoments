import createGenerate from './services/createGenerate.js';
import has from 'lodash/has.js';

export default {

  create: async function ({ body }, context) {

    const { generateType, userText, promptText } = body;

    const generate = await createGenerate({ generateType, userText, promptText }, {}, context);

    return { jobId: generate.jobId }

  },

};