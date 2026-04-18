const ROLE_MAP = {
  owner: 'OWNER',
  author: 'AUTHOR',
};

export default async function resolveAuthors({ pgScenario, pool, models, fallbackUserId }) {

  const emails = new Set();
  let originalAuthorEmail = null;

  if (pgScenario.author_id) {
    const authorResult = await pool.query(
      'SELECT email FROM users WHERE id = $1',
      [pgScenario.author_id]
    );
    if (authorResult.rows.length > 0 && authorResult.rows[0].email) {
      originalAuthorEmail = authorResult.rows[0].email;
      emails.add(originalAuthorEmail);
    }
  }

  const collaboratorsResult = await pool.query(`
    SELECT u.email, sur.role
    FROM scenario_user_role sur
    JOIN users u ON u.id = sur.user_id
    WHERE sur.scenario_id = $1 AND sur.ended_at IS NULL AND u.email IS NOT NULL
  `, [pgScenario.id]);

  const emailRoles = new Map();
  for (const row of collaboratorsResult.rows) {
    const role = ROLE_MAP[row.role?.toLowerCase()];
    if (role) {
      emails.add(row.email);
      emailRoles.set(row.email, role);
    }
  }

  if (originalAuthorEmail && !emailRoles.has(originalAuthorEmail)) {
    emailRoles.set(originalAuthorEmail, 'OWNER');
  }

  const emailList = Array.from(emails);
  const mongoUsers = await models.User.find({ email: { $in: emailList } });
  const emailToUserId = new Map();
  for (const user of mongoUsers) {
    emailToUserId.set(user.email, user._id);
  }

  const collaborators = [];
  for (const [email, role] of emailRoles.entries()) {
    const userId = emailToUserId.get(email);
    if (userId) {
      collaborators.push({ user: userId, role });
    }
  }

  let createdBy = fallbackUserId;
  if (originalAuthorEmail && emailToUserId.has(originalAuthorEmail)) {
    createdBy = emailToUserId.get(originalAuthorEmail);
  }

  if (collaborators.length === 0) {
    collaborators.push({ user: fallbackUserId, role: 'OWNER' });
  }

  const matched = collaborators.length;
  const notMatched = emailList.length - mongoUsers.length;

  return {
    createdBy,
    collaborators,
    originalAuthorEmail,
    pgEmailCount: emailList.length,
    matchedCount: matched,
    unmatchedCount: notMatched,
  };
}
