import createGenerate from './services/createGenerate.js';
import has from 'lodash/has.js';

export default {

  create: async function ({ body }, context) {

    const { generateType, prompts, actions } = body;

    const generate = await createGenerate({ generateType, prompts, actions }, {}, context);

    return { generate }

  },

};