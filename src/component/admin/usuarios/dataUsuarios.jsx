"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function DataUsuariosComponent({ data, perfiles }) {
  const [name, setName] = useState(data.fullname);
  const [perfil, setPerfil] = useState(data.idprofile);
  const [estatus, setEstatus] = useState(data.status);
  const [isExterno, setIsExterno] = useState(data.externo == 0 ? true : false);

  useEffect(() => {
    console.log(isExterno);
  }, [isExterno]);
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <Input
            label="Nombre"
            name="name"
            size="sm"
            className="max-w-sm"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <Input
            label="Correo"
            name="email"
            size="sm"
            isDisabled
            className="max-w-sm"
            value={data.email}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <Checkbox isSelected={isExterno} onValueChange={setIsExterno}>
            Usuario externo
          </Checkbox>
        </div>
        <div>
          <Select
            className="max-w-xs"
            label="Estatus"
            defaultSelectedKeys={[estatus]}
            onChange={(e) => {
              setEstatus(e.target.value);
            }}
          >
            <SelectItem key="active">Activo</SelectItem>
            <SelectItem key="inactive">Cancelado o inactivo</SelectItem>
            <SelectItem key="pending">Pendiente de confirmacion</SelectItem>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Select
          className="max-w-xs"
          label="perfiles"
          selectedKey={[perfil]}
          onChange={(e) => {
            setPerfil(e.target.value);
          }}
        >
          {perfiles.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
