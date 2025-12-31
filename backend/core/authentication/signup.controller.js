import signupParticipantUser from "#core/users/services/signupParticipantUser.js";

export default {

  create: async function ({ body }, context) {
    const { username, email, password, confirmPassword } = body;

    const user = await signupParticipantUser({ username, email, password, confirmPassword }, {}, context);

    return { user };

  },
};