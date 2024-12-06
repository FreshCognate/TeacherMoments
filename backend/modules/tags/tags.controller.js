import getTags from './services/getTags.js';
import getTagById from './services/getTagById.js';
import restoreTagById from './services/restoreTagById.js';
import updateTagById from './services/updateTagById.js';
import deleteTagById from './services/deleteTagById.js';
import createTag from './services/createTag.js';
import has from 'lodash/has.js';

export default {
  all: async function ({ query }, context) {

    const { searchValue, currentPage, isDeleted } = query;

    return await getTags({}, { searchValue, currentPage, isDeleted }, context);

  },

  create: async function ({ body }, context) {

    const { name, tagType } = body;

    const tag = await createTag({ name, tagType }, {}, context);

    return { tag };

  },
  read: async function ({ param }, context) {

    const tag = await getTagById({ tagId: param }, {}, context);
    return { tag };

  },

  update: async function ({ param, body }, context) {

    if (has(body, 'isDeleted')) {
      const tag = await restoreTagById({ tagId: param }, {}, context);
      return { tag };
    }

    const tag = await updateTagById({ tagId: param, update: body }, {}, context);

    return { tag };

  },
  delete: async function ({ param }, context) {
    const tag = await deleteTagById({ tagId: param }, {}, context);

    return { tag };
  }
};