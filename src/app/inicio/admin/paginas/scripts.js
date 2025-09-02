import pool from "@/libs/mysql";

export const getData = async () => {
  const connection = await pool.getConnection();

  const queryViews = `SELECT * FROM views order by position ASC;`;
  const [resultViews] = await connection.query(queryViews, []);

  if (resultViews.length > 0) {
    return resultViews;
  } else {
    return [];
  }
};
