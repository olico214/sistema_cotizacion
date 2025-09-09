import { validateCookie } from "@/libs/usercontroller/usercontroller";
import CotizacionDetailPageComponent from "./clientComponent";
import { redirect } from "next/navigation";

export default async function CotizacionDetailPage() {
    const id = await validateCookie();
    const user = id.value;
    if (!user) {
        return redirect("/login");
    }
    return (
        <div>
            <CotizacionDetailPageComponent user={user} />
        </div>
    )

}