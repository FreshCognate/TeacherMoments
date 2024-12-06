import getUsers from './services/getUsers.js';
import getUserById from './services/getUserById.js';
import updateUserById from './services/updateUserById.js';
import deleteUserById from './services/deleteUserById.js';
import createAuthoringUsers from './services/createAuthoringUsers.js';
import restoreUserById from './services/restoreUserById.js';
import has from 'lodash/has.js';

export default {
  all: async function ({ query }, context) {

    const { searchValue, currentPage, isDeleted } = query;

    return await getUsers({}, { searchValue, currentPage, isDeleted }, context);

  },

  create: async function ({ body }, context) {

    const { emails, role = 'user' } = body;

    return await createAuthoringUsers({ emails, role }, {}, context);

  },

  read: async function ({ param }, context) {

    const user = await getUserById({ userId: param }, {}, context);
    return { user };

  },

  update: async function ({ param, body }, context) {

    if (has(body, 'isDeleted')) {
      const user = await restoreUserById({ userId: param }, {}, context);

      return { user };
    }

    const user = await updateUserById({ userId: param, update: body }, {}, context);

    return { user };

  },
  delete: async function ({ param }, context) {
    const user = await deleteUserById({ userId: param }, {}, context);

    return { user };
  }
};