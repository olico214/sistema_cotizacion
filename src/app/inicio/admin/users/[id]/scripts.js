import pool from "@/libs/mysql-safe";

export const getData = async (id) => {
  const connection = await pool.getConnection();

  const queryViews = `SELECT t0.id as idUser,t0.email,t0.status,t0.userID,t2.name,t2.id as idprofile , t1.fullname ,t0.externo FROM users t0 left join user_profile t1  on t0.id = t1.user left join perfiles t2 on t2.id = t1.profile where t0.userID = ?;`;
  const [resultpages] = await connection.query(queryViews, [id]);

  const queryperfiles = `SELECT * FROM perfiles`;
  const [resultPerfiles] = await connection.query(queryperfiles, []);

  const data = {
    resultpages: resultpages.length > 0 ? resultpages : [],
    resultPerfiles: resultPerfiles.length > 0 ? resultPerfiles : [],
  };
  return data;
};
