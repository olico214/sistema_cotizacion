"use client";
import { Button, Checkbox, CheckboxGroup } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PagesList({ pages, id }) {
  const [selected, setSelected] = useState([]);
  const groupedPages = pages.reduce((acc, item) => {
    if (!acc[item.apps]) {
      acc[item.apps] = [];
    }
    acc[item.apps].push(item);
    return acc;
  }, {});

  useEffect(() => {
    const arreglo = [];
    for (let item of pages) {
      if (item.seleccionado) {
        arreglo.push(item.id);
      }
      setSelected(arreglo);
    }
  }, [pages]);

  const handleSave = async () => {
    const data = {
      opciones: selected,
      id: id,
    };
    const response = await fetch("/api/admin/perfiles/paginas/" + id, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      toast.success("Datos guardados correctamente", {
        duration: 2000,
      });
    }
  };
  return (
    <div className="grid mx-auto  items-center  gap-5 shadow-md p-4 rounded-md">
      {Object.entries(groupedPages).map(([category, items]) => (
        <div key={category} className="w-full  gap-2 ">
          <CheckboxGroup
            color="primary"
            label={category}
            orientation="horizontal"
            value={selected}
            onValueChange={setSelected}
          >
            {items.map((item) => (
              <Checkbox key={item.id} value={item.id}>
                {item.page}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
      ))}
      <div>
        <Button color="default" variant="bordered" onPress={handleSave}>
          Guardar
        </Button>
      </div>
    </div>
  );
}
