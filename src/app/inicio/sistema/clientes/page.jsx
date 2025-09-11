import { validateCookie } from "@/libs/usercontroller/usercontroller";
import { redirect } from "next/navigation";

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
                <ClientesTable />
            </div>
        </div>
    )
}