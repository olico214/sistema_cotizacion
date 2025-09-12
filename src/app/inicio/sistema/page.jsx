import { redirect } from "next/navigation";
import { validateCookie } from "@/libs/usercontroller/usercontroller";
import CotizacionesTable from "./components/tablecotizaciones";

export default async function SistemaPAge() {
    const id = await validateCookie();
    const user = id.value;
    if (!user) {
        return redirect("/login");
    }

    // Hacemos la carga de datos del lado del servidor
    const res = await fetch(process.env.FRONTEND_URL + "/api/listado-cotizaciones");
    const data = await res.json();
    const result = data.data ? data.data : [];

    return (
        <div>
            {/* Pasamos los datos iniciales como prop al componente de cliente */}
            <CotizacionesTable initialData={result} />
        </div>
    );
}