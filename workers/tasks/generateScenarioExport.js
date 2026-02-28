import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';
import buildScenarioCsvRows from '../../backend/modules/exports/helpers/buildScenarioCsvRows.js';
import uploadExportToS3 from '../../backend/modules/exports/helpers/uploadExportToS3.js';
import csvWriter from 'csv-write-stream';
import { PassThrough } from 'stream';
import uniqBy from 'lodash/uniqBy.js';
import map from 'lodash/map.js';

const rowsToCsvBuffer = (rows) => {
  return new Promise((resolve, reject) => {
    const headers = rows[0];
    const writer = csvWriter({ headers, sendHeaders: true });
    const passThrough = new PassThrough();
    const chunks = [];

    passThrough.on('data', (chunk) => chunks.push(chunk));
    passThrough.on('end', () => resolve(Buffer.concat(chunks)));
    passThrough.on('error', reject);

    writer.pipe(passThrough);

    for (let i = 1; i < rows.length; i++) {
      writer.write(rows[i]);
    }

    writer.end();
  });
};

export default async ({ exportId, exportType, scenarioId, cohortId }) => {

  const { models } = await connectDatabase();

  await models.Export.findByIdAndUpdate(exportId, { status: 'PROCESSING' });

  const scenario = await models.Scenario.findById(scenarioId).lean();

  let users;

  if (exportType === 'COHORT_SCENARIO') {
    users = await models.User.find({ 'cohorts.cohort': cohortId, isDeleted: false }).lean();
  } else {
    const runs = await models.Run.find({ scenario: scenarioId, isDeleted: false }).lean();
    const userIds = map(uniqBy(runs, 'user'), 'user');
    users = await models.User.find({ _id: { $in: userIds }, isDeleted: false }).lean();
  }

  const rows = await buildScenarioCsvRows({ scenarioId, users, models });
  const csvBuffer = await rowsToCsvBuffer(rows);

  const scenarioName = (scenario?.name || 'export').replace(/[^a-zA-Z0-9-_]/g, '_');
  const fileName = `${scenarioName}_responses.csv`;
  const filePath = `exports/${exportId}/${fileName}`;

  await uploadExportToS3({
    filePath,
    body: csvBuffer,
    contentType: 'text/csv',
    contentDisposition: `attachment; filename="${fileName}"`
  });

  await models.Export.findByIdAndUpdate(exportId, {
    status: 'COMPLETED',
    fileName,
    filePath,
    fileSize: csvBuffer.length,
    completedAt: new Date()
  });

};
