import registerAuthoringUser from './registerAuthoringUser.js';

export default async ({ emails, role }, context) => {

  const { user } = context;

  if (emails && emails.length) {

    for (const email of emails) {

      await registerAuthoringUser({
        email,
        role
      }, context);

    }
  }

  return {};
};