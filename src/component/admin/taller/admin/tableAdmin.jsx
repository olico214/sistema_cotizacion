"use client";
import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TableAdminComponent({ admin = [] }) {
  const route = useRouter();
  const [loading, setLoading] = useState(true);

  // Corregimos el efecto para que reaccione correctamente al cambio de 'admin'
  useEffect(() => {
    if (admin && admin.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [admin]);

  const handleDelete = async (id) => {
    const response = await fetch("/api/admin/taller/admin", {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
    });
    if (response.ok) {
      route.refresh();
      toast.success("DATOS ELIMINADOS CON EXITO");
    }
  };

  if (loading)
    return (
      <Skeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300" />
      </Skeleton>
    );

  return (
    <div>
      <Table aria-label="Tabla de administradores">
        <TableHeader>
          <TableColumn>Clave</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Accion</TableColumn>
        </TableHeader>
        <TableBody>
          {admin.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.clave || "N/A"}</TableCell>
              <TableCell>{item.fullname || "Nombre no disponible"}</TableCell>
              <TableCell>
                <Button
                  color="danger"
                  variant="ghost"
                  onPress={async () => {
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
