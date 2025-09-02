import { validateCookie } from "@/libs/usercontroller/usercontroller";
import { redirect } from "next/navigation";
import UsersTable from "./components/usertable/usertable";

export default async function UsuariosPage() {
    const id = await validateCookie();
    const user = id.value;
    if (!user) {
        return redirect("/login");
    }
    return (
        <div>
            <div>
                <UsersTable />
            </div>

        </div>
    )
}