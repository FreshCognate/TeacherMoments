import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';
import buildScenarioCsvRows from '../../backend/modules/exports/helpers/buildScenarioCsvRows.js';
import rowsToCsvBuffer from '../../backend/modules/exports/helpers/rowsToCsvBuffer.js';
import uploadExportToS3 from '../../backend/modules/exports/helpers/uploadExportToS3.js';
import archiver from 'archiver';

const createZipBuffer = (csvFiles) => {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks = [];

    archive.on('data', (chunk) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);

    for (const { name, buffer } of csvFiles) {
      archive.append(buffer, { name });
    }

    archive.finalize();
  });
};

export default async ({ exportId, exportType, cohortId, userId }) => {

  const { models } = await connectDatabase();

  await models.Export.findByIdAndUpdate(exportId, { status: 'PROCESSING' });

  let scenarios;
  let users;

  if (exportType === 'COHORT_USER') {
    scenarios = await models.Scenario.find({ 'cohorts.cohort': cohortId, isDeleted: false }).sort('name').lean();
    users = await models.User.find({ _id: userId, isDeleted: false }).lean();
  } else if (exportType === 'COHORT_ALL') {
    scenarios = await models.Scenario.find({ 'cohorts.cohort': cohortId, isDeleted: false }).sort('name').lean();
    users = await models.User.find({ 'cohorts.cohort': cohortId, isDeleted: false }).lean();
  } else if (exportType === 'USER_HISTORY') {
    const runs = await models.Run.find({ user: userId, isDeleted: false }).lean();
    const scenarioIds = [...new Set(runs.map((run) => String(run.scenario)))];
    scenarios = await models.Scenario.find({ _id: { $in: scenarioIds }, isDeleted: false }).sort('name').lean();
    users = await models.User.find({ _id: userId, isDeleted: false }).lean();
  }

  const csvFiles = [];

  for (const scenario of scenarios) {
    const rows = await buildScenarioCsvRows({ scenarioId: scenario._id, users, models });

    if (rows.length <= 1) continue;

    const csvBuffer = await rowsToCsvBuffer(rows);
    const scenarioName = (scenario.name || 'export').replace(/[^a-zA-Z0-9-_]/g, '_');
    csvFiles.push({ name: `${scenarioName}.csv`, buffer: csvBuffer });
  }

  const zipBuffer = await createZipBuffer(csvFiles);

  const fileName = 'export.zip';
  const filePath = `exports/${exportId}/${fileName}`;

  await uploadExportToS3({
    filePath,
    body: zipBuffer,
    contentType: 'application/zip',
    contentDisposition: `attachment; filename="${fileName}"`
  });

  await models.Export.findByIdAndUpdate(exportId, {
    status: 'COMPLETED',
    fileName,
    filePath,
    fileSize: zipBuffer.length,
    completedAt: new Date()
  });

};
