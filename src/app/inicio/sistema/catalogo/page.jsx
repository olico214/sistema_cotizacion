import { validateCookie } from "@/libs/usercontroller/usercontroller";
import { redirect } from "next/navigation";
import CatalogosPage from "./components/catalogocomponent";

export default async function UsuariosPage() {
    const id = await validateCookie();
    const user = id.value;
    if (!user) {
        return redirect("/login");
    }
    return (
        <div>
            <div>
                <CatalogosPage />
            </div>

        </div>
    )
}