import createExport from './services/createExport.js';
import getExportById from './services/getExportById.js';
import deleteExport from './services/deleteExport.js';

export default {

  create: async function ({ body }, context) {
    const { exportType, scenarioId, cohortId, userId } = body;
    return await createExport({ exportType, scenarioId, cohortId, userId }, {}, context);
  },

  read: async function ({ param }, context) {
    return await getExportById({ exportId: param }, {}, context);
  },

  delete: async function ({ param }, context) {
    return await deleteExport({ exportId: param }, {}, context);
  }

};
