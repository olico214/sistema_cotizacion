import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Car, CarFront, ClipboardPlus, History } from "lucide-react"; // Importa los iconos

const iconOptions = [
  { label: "Vehiculo", value: "vehiculo", icon: <CarFront size={18} /> },
  { label: "Poliza", value: "poliza", icon: <ClipboardPlus size={18} /> },
  { label: "Historial", value: "track", icon: <History size={18} /> },
  { label: "Recorridos", value: "recorridos", icon: <Car size={18} /> },
];

export default function TableTabs({ data, refreshData }) {
  const handleDelete = async (id) => {
    await fetch("/api/admin/activos/tabs/" + id, { method: "DELETE" });
    refreshData();
  };

  return (
    <div className="max-h-[500px] overflow-auto">
      <Table aria-label="Tabla de pestañas">
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Tab</TableColumn>
          <TableColumn>Eliminar</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            // Busca el icono correspondiente

            return (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>

                <TableCell>{item.tab}</TableCell>
                <TableCell>
                  <Button color="danger" onPress={() => handleDelete(item.id)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
