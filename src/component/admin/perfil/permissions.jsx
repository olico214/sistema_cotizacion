"use client";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";
import { useState } from "react";

export default function SetPermision({ id }) {
  const [selected, setSelected] = useState(["buenos-aires", "sydney"]);
  return (
    <div className="p-4 shadow-md rounded-md">
      <div>
        <CheckboxGroup
          color="primary"
          label="Permisos"
          value={selected}
          onValueChange={setSelected}
          orientation="horizontal"
        >
          <Checkbox value="1">Registrar nuevos usuarios</Checkbox>
          <Checkbox value="2">Editar usuarios</Checkbox>
          <Checkbox value="3">Aceptar movimientos de nomina</Checkbox>
        </CheckboxGroup>
        <p className="text-default-500 text-small">
          Selected: {selected.join(", ")}
        </p>
      </div>
    </div>
  );
}
