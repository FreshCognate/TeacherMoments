import pg from 'pg';

const COMPONENT_TYPE_MAP = {
  Text: 'TEXT',
  MultiButtonResponse: 'MULTIPLE_CHOICE_PROMPT',
  AudioResponse: 'INPUT_PROMPT',
  TextResponse: 'INPUT_PROMPT',
  AudioPrompt: 'INPUT_PROMPT',
  ResponseRecall: 'RESPONSE',
  MultiPathResponse: 'ACTIONS_PROMPT',
  Suggestion: 'SUGGESTION',
  ChatPrompt: 'TEXT',
  ConditionalContent: 'TEXT',
  AnnotationPrompt: 'TEXT',
  ConversationPrompt: 'TEXT',
};

function log(dryRun, ...args) {
  const prefix = dryRun ? '[DRY RUN]' : '[Migration]';
  console.log(prefix, ...args);
}

export default async (data) => {

  const { postgresUrl, scenarioIds, dryRun } = data;

  log(dryRun, '=== STARTING MIGRATION ===');
  log(dryRun, `Mode: ${dryRun ? 'DRY RUN (no writes)' : 'LIVE'}`);
  log(dryRun, `Scenario filter: ${scenarioIds ? scenarioIds.join(', ') : 'ALL'}`);

  const pool = new pg.Pool({
    connectionString: postgresUrl,
    ssl: { rejectUnauthorized: false }
  });

  const summary = {
    totalScenarios: 0,
    succeeded: 0,
    failed: 0,
    totalSlides: 0,
    totalComponents: 0,
    componentsByType: {},
    failures: []
  };

  try {

    let scenarioQuery = `
      SELECT id, title, description, is_example, status, created_at, updated_at
      FROM scenario
      WHERE deleted_at IS NULL
    `;
    const queryParams = [];

    if (scenarioIds && scenarioIds.length > 0) {
      scenarioQuery += ' AND id = ANY($1)';
      queryParams.push(scenarioIds);
    }

    scenarioQuery += ' ORDER BY id';

    const scenarioResult = await pool.query(scenarioQuery, queryParams);
    const scenarios = scenarioResult.rows;

    summary.totalScenarios = scenarios.length;
    log(dryRun, `Found ${scenarios.length} scenarios to migrate`);

    for (let i = 0; i < scenarios.length; i++) {
      const scenario = scenarios[i];

      try {
        log(dryRun, '');
        log(dryRun, `Scenario ${i + 1}/${scenarios.length}: "${scenario.title}" (PG ID: ${scenario.id})`);
        log(dryRun, `  Description: ${scenario.description ? scenario.description.substring(0, 80) + '...' : '(none)'}`);
        log(dryRun, `  Is example: ${scenario.is_example}, Status: ${scenario.status}, Created: ${scenario.created_at}`);

        const slideResult = await pool.query(`
          SELECT id, title, "order", is_finish, has_chat_enabled, components
          FROM slide
          WHERE scenario_id = $1
          ORDER BY "order" ASC
        `, [scenario.id]);

        const slides = slideResult.rows;
        summary.totalSlides += slides.length;

        log(dryRun, `  Found ${slides.length} slides`);

        for (let j = 0; j < slides.length; j++) {
          const slide = slides[j];
          const components = slide.components || [];
          const slideType = slide.is_finish ? 'SUMMARY' : 'STEP';

          summary.totalComponents += components.length;

          log(dryRun, `  Slide ${j + 1}/${slides.length}: "${slide.title || '(untitled)'}" (PG ID: ${slide.id}, order: ${slide.order}, type: ${slideType}, chat: ${slide.has_chat_enabled})`);

          for (let k = 0; k < components.length; k++) {
            const component = components[k];
            const componentType = component.type || 'Unknown';
            const blockType = COMPONENT_TYPE_MAP[componentType] || 'TEXT';

            summary.componentsByType[componentType] = (summary.componentsByType[componentType] || 0) + 1;

            let details = `${componentType} → ${blockType}`;

            if (componentType === 'Text') {
              const textLength = (component.html || '').length;
              details += ` (html: ${textLength} chars)`;
            } else if (componentType === 'MultiButtonResponse') {
              const buttonCount = (component.buttons || []).length;
              details += ` (${buttonCount} options, responseId: "${component.responseId}")`;
            } else if (componentType === 'TextResponse') {
              details += ` (responseId: "${component.responseId}", required: ${component.required})`;
            } else if (componentType === 'AudioResponse') {
              details += ` (responseId: "${component.responseId}")`;
            } else if (componentType === 'AudioPrompt') {
              details += ` (responseId: "${component.responseId}", required: ${component.required})`;
            } else if (componentType === 'ResponseRecall') {
              details += ` (recallId: "${component.recallId}")`;
            } else if (componentType === 'MultiPathResponse') {
              const pathCount = (component.paths || []).length;
              details += ` (${pathCount} paths, responseId: "${component.responseId}")`;
            } else if (componentType === 'Suggestion') {
              details += ` (color: ${component.color}, persona: ${component.persona ? component.persona.id : 'none'})`;
            } else if (componentType === 'ConditionalContent') {
              const hasInnerHtml = component.component && component.component.html;
              details += ` (has inner html: ${!!hasInnerHtml})`;
            }

            log(dryRun, `    Block ${k + 1}/${components.length}: ${details}`);
          }
        }

        summary.succeeded++;

      } catch (error) {
        summary.failed++;
        summary.failures.push({ pgId: scenario.id, title: scenario.title, error: error.message });
        log(dryRun, `  ERROR migrating scenario "${scenario.title}" (PG ID: ${scenario.id}): ${error.message}`);
      }
    }

  } finally {
    await pool.end();
  }

  log(dryRun, '');
  log(dryRun, '=== COMPLETE ===');
  log(dryRun, `Total scenarios: ${summary.totalScenarios} | Succeeded: ${summary.succeeded} | Failed: ${summary.failed}`);
  log(dryRun, `Total slides: ${summary.totalSlides}`);
  log(dryRun, `Total components: ${summary.totalComponents}`);
  log(dryRun, `Components by type:`, summary.componentsByType);

  if (summary.failures.length > 0) {
    log(dryRun, `Failed scenarios:`, summary.failures);
  }

};
