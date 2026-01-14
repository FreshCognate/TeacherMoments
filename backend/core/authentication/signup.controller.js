import signupParticipantUser from "#core/users/services/signupParticipantUser.js";
import verifyOtp from "./services/verifyOtp.js";

export default {

  create: async function ({ body }, context) {
    const { username, email } = body;

    const result = await signupParticipantUser({ username, email }, {}, context);

    return result;
  },

  update: async function ({ body }, context) {
    const { email, otpCode } = body;

    const user = await verifyOtp({ email, otpCode }, context);

    return { user };
  }
};