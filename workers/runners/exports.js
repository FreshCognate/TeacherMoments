import '../../backend/core/users/index.js';
import '../../backend/modules/exports/index.js';
import '../../backend/modules/responses/index.js';
import '../../backend/modules/scenarios/index.js';
import '../../backend/modules/slides/index.js';
import '../../backend/modules/blocks/index.js';
import '../../backend/modules/runs/index.js';
import '../../backend/modules/assets/index.js';
import generateScenarioExport from '../tasks/generateScenarioExport.js';
import getSockets from '../getSockets.js';

export default async (job) => {
  try {

    let sockets;

    switch (job.name) {
      case 'GENERATE_EXPORT': {

        sockets = await getSockets();

        sockets.emit(`workers:exports:${job.id}`, {
          event: 'EXPORT_PROCESSING'
        });

        const { exportType } = job.data;

        if (exportType === 'SCENARIO_RESPONSES' || exportType === 'COHORT_SCENARIO') {
          await generateScenarioExport(job.data);
        }

        sockets = await getSockets();

        sockets.emit(`workers:exports:${job.id}`, {
          event: 'EXPORT_COMPLETED',
          exportId: job.data.exportId
        });

        break;
      }
    }
  } catch (error) {
    console.log(error);

    const { models } = await (await import('../../backend/core/databases/helpers/connectDatabase.js')).default();
    await models.Export.findByIdAndUpdate(job.data.exportId, { status: 'FAILED' });

    const sockets = await getSockets();
    sockets.emit(`workers:exports:${job.id}`, {
      event: 'EXPORT_FAILED'
    });

    throw new Error(error);
  }
};
