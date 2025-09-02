export const getOpciones = async (id) => {
  const response = await fetch("/api/admin/activos/opciones/" + id);
  const result = await response.json();
  return result.result;
};

export const getStatus = async () => {
  const response = await fetch("/api/admin/activos/estatus");
  const result = await response.json();
  return result.result;
};
