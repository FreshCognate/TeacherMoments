import getTags from './services/getTags.js';
import getTagById from './services/getTagById.js';
import updateTagById from './services/updateTagById.js';
import deleteTagById from './services/deleteTagById.js';
import createTag from './services/createTag.js';

export default {
  all: async function ({ query }, context) {

    const { searchValue, currentPage, isDeleted } = query;

    return await getTags({ options: { searchValue, currentPage, isDeleted } }, context);

  },

  create: async function ({ body }, context) {

    const { name, tagType } = body;

    return await createTag({ name, tagType }, context);

  },
  read: async function ({ param }, context) {

    const tag = await getTagById({ userId: param }, context);
    return { tag };

  },

  update: async function ({ param, body }, context) {

    const tag = await updateTagById({ tagId: param, update: body }, context);

    return { tag };

  },
  delete: async function ({ param }, context) {
    const tag = await deleteTagById({ tagId: param }, context);

    return { tag };
  }
};