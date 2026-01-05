import signupParticipantUser from "#core/users/services/signupParticipantUser.js";
import verifyParticipantUser from "#core/users/services/verifyParticipantUser.js";

export default {

  create: async function ({ body }, context) {
    const { username, email, password, confirmPassword } = body;

    const user = await signupParticipantUser({ username, email, password, confirmPassword }, {}, context);

    return { user };

  },

  update: async function ({ body, param }, context) {
    const { code } = body;

    const user = await verifyParticipantUser({ userId: param, code }, {}, context);

    return { user };

  }
};