import pool from "@/libs/mysql";

export const getData = async () => {
  const connection = await pool.getConnection();

  const queryViews = `SELECT t0.email,t0.status,t0.userID,t2.name, t1.fullname,t1.clave FROM users t0 
  left join user_profile t1  on t0.id = t1.user left join perfiles
   t2 on t2.id = t1.profile;`;
  const [resultViews] = await connection.query(queryViews, []);

  if (resultViews.length > 0) {
    return resultViews;
  } else {
    return [];
  }
};
