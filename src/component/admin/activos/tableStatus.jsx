import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import OpcionesComponent from "./descripcion/opciones";

export default function TableActivos({ data, refreshData }) {
  const handleDelete = async (id) => {
    const response = await fetch("/api/admin/activos/estatus/" + id, {
      method: "DELETE",
    });
    refreshData();
  };
  return (
    <div className=" max-h-[500px] overflow-auto">
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Color</TableColumn>
          <TableColumn>Agregar opciones</TableColumn>
          <TableColumn>Eliminar</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <div className={`${item.color} rounded-md p-3 text-center`}>
                  color
                </div>
              </TableCell>
              <TableCell>
                <OpcionesComponent id={item.id} />
              </TableCell>
              <TableCell>
                <Button
                  color="danger"
                  onPress={async (e) => {
                    await handleDelete(item.id);
                  }}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
