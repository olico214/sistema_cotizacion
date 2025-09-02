import { validateCookie } from "@/libs/usercontroller/usercontroller";
import { redirect } from "next/navigation";
import ClienteComponent from "./components/registroCliente/registrarCliente";
import ClientesTable from "./components/tableClientes/tableClientes";

export default async function ClientesPage() {
    const id = await validateCookie();
    const user = id.value;
    if (!user) {
        return redirect("/login");
    }
    return (
        <div>
            <div>
                <ClienteComponent />
            </div>
            <div>
                <ClientesTable />
            </div>
        </div>
    )
}