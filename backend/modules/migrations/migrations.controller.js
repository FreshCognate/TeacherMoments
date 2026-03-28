import pg from 'pg';
import createJob from '#core/queues/helpers/createJob.js';

export default {
  all: async function ({ query }) {

    const pool = new pg.Pool({
      connectionString: query.postgresUrl,
      ssl: { rejectUnauthorized: false }
    });

    try {
      const result = await pool.query(`
        SELECT
          s.id,
          s.title,
          s.description,
          s.is_example,
          s.created_at,
          s.status,
          COUNT(sl.id) as slide_count
        FROM scenario s
        LEFT JOIN slide sl ON sl.scenario_id = s.id
        WHERE s.deleted_at IS NULL
        GROUP BY s.id
        ORDER BY s.id
      `);

      return {
        scenarios: result.rows.map(row => ({
          id: row.id,
          title: row.title,
          description: row.description,
          isExample: row.is_example || false,
          status: row.status,
          slideCount: parseInt(row.slide_count, 10),
          createdAt: row.created_at
        }))
      };
    } finally {
      await pool.end();
    }

  },

  create: async function ({ body }, context) {

    const job = await createJob({
      queue: 'migrations',
      name: 'migratePostgresScenarios',
      job: {
        postgresUrl: body.postgresUrl,
        scenarioIds: body.scenarioIds || null,
        dryRun: body.dryRun !== undefined ? body.dryRun : true,
        createdBy: context.user._id,
        createdAt: new Date()
      }
    });

    return { jobId: job.id };

  }
};
