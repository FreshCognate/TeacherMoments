import createGenerate from './services/createGenerate.js';
import has from 'lodash/has.js';

export default {

  create: async function ({ body }, context) {

    const { generateType, payload } = body;

    const generate = await createGenerate({ generateType, payload }, {}, context);

    return { jobId: generate.jobId }

  },

};