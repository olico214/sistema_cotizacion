import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import AsignUsuarios from "./asignGroup";

export default function TableGroups({ data }) {
  return (
    <div className=" max-h-[500px] overflow-auto">
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Descrićión</TableColumn>
          <TableColumn>Agregar</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <AsignUsuarios item={item} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
