import TableUsers from "@/component/admin/usuarios/users";
import { getData } from "./users/scripts";

export default async function Home() {
  const data = await getData();
  return (
    <div>
      <TableUsers users={data} />
    </div>
  );
}
