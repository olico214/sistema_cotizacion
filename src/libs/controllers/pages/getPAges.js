import pool from "@/libs/mysql";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getPages(request) {
  const response = await validateCookie();
  if (!response) {
    return redirect(`/login`);
  }
  const pages = await fetchPaginasDiponibles(response.value);

  const groupedApps = pages.reduce((acc, { apps, page, url, icon }) => {
    let app = acc.find((a) => a.name === apps);
    if (!app) {
      app = { name: apps, modules: [] };
      acc.push(app);
    }
    app.modules.push({ nombre: page, ruta: url, icon: icon });
    return acc;
  }, []);
  const email = await fetchUsuario(response.value);
  return { groupedApps, pages, email };
}

const validateCookie = async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("name");
  return cookie || null;
};

export const fetchPaginasDiponibles = async (value) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
      SELECT t3.* FROM users t0 
      LEFT JOIN user_profile t1 ON t0.id = t1.user
      LEFT JOIN perfil_view t2 ON t1.profile = t2.idPerfil
      LEFT JOIN views t3 ON t3.id = t2.idPage
      WHERE t0.userID = ? and t0.status =?
      ORDER BY t3.apps desc
    `;
    const [result] = await connection.query(query, [value, "active"]);
    return result;
  } catch (error) {
    console.error("Error en la consulta:", error);
    return { tipo: "Error", error: error.message };
  } finally {
    if (connection) connection.release();
  }
};

export const fetchUsuario = async (value) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
      SELECT email FROM users WHERE userID = ?`;
    const [result] = await connection.query(query, [value]);
    return result;
  } catch (error) {
    console.error("Error en la consulta:", error);
    return { tipo: "Error", error: error.message };
  } finally {
    if (connection) connection.release();
  }
};
