import DataUsuariosComponent from "@/component/admin/usuarios/dataUsuarios";
import { getData } from "./scripts";

export default async function Home({ params }) {
  const { id } = await params;
  const data = await getData(id);
  const pages = data.resultpages;
  const perfiles = data.resultPerfiles;
  return (
    <div>
      <DataUsuariosComponent data={pages[0]} perfiles={perfiles} id={id} />
    </div>
  );
}
