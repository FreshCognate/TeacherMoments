import htmlToSlate from './htmlToSlate.js';

export default async function resolveConsent({ pgScenarioId, pool }) {

  const linkResult = await pool.query(
    'SELECT consent_id FROM scenario_consent WHERE scenario_id = $1 LIMIT 1',
    [pgScenarioId]
  );

  if (linkResult.rows.length === 0) return null;

  const consentId = linkResult.rows[0].consent_id;

  const consentResult = await pool.query(
    'SELECT prose FROM consent WHERE id = $1',
    [consentId]
  );

  if (consentResult.rows.length === 0) return null;

  const prose = consentResult.rows[0].prose;
  if (!prose || !prose.trim()) return null;

  const { slate } = htmlToSlate(prose);

  return { slate, consentId };
}
