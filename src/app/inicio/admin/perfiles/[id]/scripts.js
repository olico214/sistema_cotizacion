import pool from "@/libs/mysql";

export const getData = async (id) => {
 const connection = await pool.getConnection();


  const queryViews = `
  SELECT 
    t0.*,
    CASE WHEN t1.idPerfil IS NOT NULL THEN true ELSE false END AS seleccionado
  FROM views t0
  LEFT JOIN perfil_view t1 ON t0.id = t1.idPage AND t1.idPerfil = ?
    order by t0.apps, t0.position;
`;
  const [resultViews] = await connection.query(queryViews, [id]);

  const result = {
    resultViews: resultViews
  };

  return result;
};
