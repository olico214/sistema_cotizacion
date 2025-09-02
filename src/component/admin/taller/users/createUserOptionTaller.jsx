"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateUserOptionTaller({ empleados }) {
  const route = useRouter();
  const [selectedKey, setSelectedKey] = useState(null);
  const [value, setValue] = useState("");
  const onSelectionChange = (id) => {
    setSelectedKey(id);
  };

  const handleSelectionChange = (e) => {
    setValue(e.target.value);
  };

  const handleSave = async () => {
    const response = await fetch("/api/admin/taller/user", {
      method: "POST",
      body: JSON.stringify({ user: selectedKey, opcion: value }),
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
      <div className="flex gap-4">
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

        <Select
          size="sm"
          classNames="text-sm"
          color="primary"
          variant="bordered"
          selectedKeys={[value]}
          label="Selecciona un Grupo"
          onChange={handleSelectionChange}
        >
          <SelectItem key="Taller">Taller</SelectItem>
          <SelectItem key="GPS">GPS</SelectItem>
          <SelectItem key="DVR">DVR</SelectItem>
        </Select>
      </div>
      <div>
        <Button color="primary" variant="ghost" onPress={handleSave}>
          Guardar
        </Button>
      </div>
    </div>
  );
}
