import { pool } from '../config/db.js';
import type { JwtPayload } from '../utils/index.js';

interface IIssueQueryParams {
  type?: string;
  status?: string;
  sort?: string;
}

interface IIssueUpdatePayload {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
}

export const createIssueService = async (
  title: string,
  description: string,
  type: string,
  reporter_id: number
) => {
  //insert into issues 
  const query = `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const result = await pool.query(query, [
    title,
    description,
    type,
    reporter_id,
  ]);

  return result.rows[0];
};

export const getAllIssuesService = async (queryParams: IIssueQueryParams) => {
  const conditions: string[] = [];
  const values: string[] = [];
  let paramIndex = 1;

  if (queryParams.type) {
    conditions.push(`type = $${paramIndex}`);
    values.push(queryParams.type);
    paramIndex++;
  }

  if (queryParams.status) {
    conditions.push(`status = $${paramIndex}`);
    values.push(queryParams.status);
    paramIndex++;
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const orderClause =
    queryParams.sort === 'oldest'
      ? `ORDER BY created_at ASC`
      : `ORDER BY created_at DESC`;

  const query = `SELECT * FROM issues ${whereClause} ${orderClause}`;

  const issuesResult = await pool.query(query, values);
  const issues = issuesResult.rows;

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  // select id 
  const usersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds]
  );

  const users = usersResult.rows;

  return issues.map((issue) => {
    const reporter = users.find((user) => user.id === issue.reporter_id);
    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });
};

export const getSingleIssueService = async (id: string) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    id,
  ]);

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error('Issue not found');
  }

  const userResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id]
  );

  const reporter = userResult.rows[0];

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

export const updateIssueService = async (
  id: string,
  payload: IIssueUpdatePayload,
  user: JwtPayload
) => {
 
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    id,
  ]);

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error('Issue not found');
  }

  
  if (user.role !== 'maintainer') {
    if (issue.reporter_id !== user.id) {
      throw new Error('You are not allowed to update this issue');
    }

    if (issue.status !== 'open') {
      throw new Error('Only open issues can be updated');
    }
  }

 
  const updatedTitle = payload.title ?? issue.title;
  const updatedDescription = payload.description ?? issue.description;
  const updatedType = payload.type ?? issue.type;
  const updatedStatus = payload.status ?? issue.status;

  // deleate
  const updateQuery = `
    UPDATE issues
    SET
      title = $1,
      description = $2,
      type = $3,
      status = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *
  `;

  const result = await pool.query(updateQuery, [
    updatedTitle,
    updatedDescription,
    updatedType,
    updatedStatus,
    id,
  ]);

  return result.rows[0];
};

export const deleteIssueService = async (id: string, user: JwtPayload) => {
  
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    id,
  ]);

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error('Issue not found');
  }

  if (user.role !== 'maintainer') {
    throw new Error('Only maintainer can delete issues');
  }

  await pool.query(`DELETE FROM issues WHERE id = $1`, [id]);
};
