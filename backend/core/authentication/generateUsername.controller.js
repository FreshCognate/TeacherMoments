import generateRandomUsername from '#core/users/helpers/generateRandomUsername.js';

export default {

  all: async function (props, context) {
    const { models } = context;

    const username = await generateRandomUsername(models.User);

    return { username };
  }

};
