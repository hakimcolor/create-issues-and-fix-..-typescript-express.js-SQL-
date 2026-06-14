import { pool } from "../config/db.js";
import type { JwtPayload } from "../utils";

interface IIssueQueryParams {
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
  sort?: "newest" | "oldest";
}

interface IIssueUpdatePayload {
  title?: string;
  description?: string;
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
}


export const createIssueService = async (
  title: string,
  description: string,
  type: string,
  reporter_id: number
) => {

  const query = `
    INSERT INTO issues
    (
      title,
      description,
      type,
      reporter_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    title,
    description,
    type,
    reporter_id,
  ];

  const result = await pool.query(
    query,
    values
  );

  return result.rows[0];
};

export const getAllIssuesService = async ( queryParams: IIssueQueryParams) => {

  let query = `SELECT * FROM issues`;

  const conditions: string[] = [];

  if (queryParams.type) {
    conditions.push(
      `type = '${queryParams.type}'`
    );
  }

  if (queryParams.status) {
    conditions.push(
      `status = '${queryParams.status}'`
    );
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  if (queryParams.sort === "oldest") {
    query += ` ORDER BY created_at ASC`;
  } else {
    query += ` ORDER BY created_at DESC`;
  }

  const issuesResult = await pool.query(query);

  const issues = issuesResult.rows;

  const reporterIds = [
    ...new Set(
      issues.map(
        (issue) => issue.reporter_id
      )
    ),
  ];

  const usersQuery = `
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1)
  `;

  const usersResult = await pool.query(
    usersQuery,
    [reporterIds]
  );

  const users = usersResult.rows;

  const finalData = issues.map((issue) => {

    const reporter = users.find(
      (user) =>
        user.id === issue.reporter_id
    );

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

  return finalData;
};

export const getSingleIssueService = async (
  id: string
) => {

  const issueQuery = `
    SELECT * FROM issues
    WHERE id = $1
  `;

  const issueResult = await pool.query(
    issueQuery,
    [id]
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  const userQuery = `
    SELECT id, name, role
    FROM users
    WHERE id = $1
  `;

  const userResult = await pool.query(
    userQuery,
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

  const findQuery = `
    SELECT * FROM issues
    WHERE id = $1
  `;

  const issueResult = await pool.query(
    findQuery,
    [id]
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (user.role !== "maintainer") {
    if (issue.reporter_id !== user.id) {
      throw new Error("You are not allowed to update this issue");
    }

    if (issue.status !== "open") {
      throw new Error("Only open issues can be updated");
    }
  }

  const updateQuery = `
    UPDATE issues
    SET
      title = $1,
      description = $2,
      type = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
  `;

  const values = [
    payload.title,
    payload.description,
    payload.type,
    id,
  ];

  const result = await pool.query(
    updateQuery,
    values
  );

  return result.rows[0];
};

export const deleteIssueService = async (
  id: string,
  user: JwtPayload
) => {
    const findQuery = `
    SELECT * FROM issues
    WHERE id = $1
    `;

    const issueResult = await pool.query(
      findQuery,
      [id]
    );

    const issue = issueResult.rows[0];

    if (!issue) {
      throw new Error("Issue not found");
    }


    if (user.role !== "maintainer") {
      throw new Error(
        "Only maintainer can delete issues"
      );
    }

    const deleteQuery = `
      DELETE FROM issues
      WHERE id = $1
    `;

    await pool.query(deleteQuery, [id]);

    return;
};