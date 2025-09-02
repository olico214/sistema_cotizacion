import { validateCookie } from "@/libs/usercontroller/usercontroller";
import RegisterProduct from "./components/register/registerProduct";
import TableProducts from "./components/tableProducts/tableProducts";
import { redirect } from "next/navigation";

export default async function ProductosPage() {
    const id = await validateCookie();
    const user = id.value;
    if (!user) {
        return redirect("/login");
    }
    return (
        <div>
            <div>
                <RegisterProduct />
            </div>
            <div>
                <TableProducts />
            </div>
        </div>
    )
}