import ViewPagePerfilComponent from "@/component/admin/perfil/selectViews";
import CrearPerfil from "@/component/admin/perfil/crearPerfiles";
import { getData } from "./scripts";

export default async function PerfilComponent({ params }) {
  const { id } = await params;
  const result = await getData(id);
  const resultViews = result.resultViews;
  return (
    <div className="grid grid-cols-1 gap-2 max-h-[1080px] overflow-auto">
      <div>
        <CrearPerfil id={id} />
      </div>
      <div>
        <ViewPagePerfilComponent pages={resultViews} id={id} />
      </div>
    </div>
  );
}
