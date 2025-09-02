"use client";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateAdminTaller({ empleados }) {
  const route = useRouter();
  const [selectedKey, setSelectedKey] = useState(null);

  const onSelectionChange = (id) => {
    setSelectedKey(id);
  };

  const handleSave = async () => {
    const response = await fetch("/api/admin/taller/admin", {
      method: "POST",
      body: JSON.stringify({ user: selectedKey }),
    });
    if (response.ok) {
      route.refresh();
      toast.success("Datos guardados con exito");
    } else {
      toast.error("Registro Duplicado");
    }
  };
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Autocomplete
          className="max-w-xs"
          defaultItems={empleados}
          label="Empleados"
          size="sm"
          classNames="text-sm"
          color="primary"
          variant="bordered"
          onSelectionChange={onSelectionChange}
        >
          {(item) => (
            <AutocompleteItem
              key={item.id}
            >{`(${item.clave}) - ${item.fullname}`}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <div>
        <Button color="primary" variant="ghost" onPress={handleSave}>
          Guardar
        </Button>
      </div>
    </div>
  );
}
