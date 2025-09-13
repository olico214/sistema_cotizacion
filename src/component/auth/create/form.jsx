"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  SelectItem,
  Checkbox,
} from "@nextui-org/react";
import { toast } from "sonner";

export default function RegisterLogin() {
  const [action, setAction] = useState(null);
  const [perfiles, setPerfiles] = useState([]);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    asyncfetchPerfiles();
  }, [setPerfiles]);

  const asyncfetchPerfiles = async () => {
    const response = await fetch("/api/admin/perfiles");
    const data = await response.json();
    const result = data.result;
    setPerfiles(result);
  };
  return (
    <Form
      className="grid  gap-4 "
      validationBehavior="native"
      onSubmit={async (e) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));
        data.externo = isSelected;
        const response = await fetch("/api/auth/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          toast.success("Usuario creado con exito");
        } else {
          const error = await response.json();
          toast.error("Error al crear usuario: " + error.error.message);
        }
        setAction(`submit ${JSON.stringify(data)}`);
      }}
    >
      <div className="">
        <Input
          isRequired
          errorMessage="Nombre Completo"
          label="Nombre completo"
          labelPlacement="outside"
          name="name"
        />
        <Input
          label="Clave"
          errorMessage="Clave"
          labelPlacement="outside"
          name="clave"
        />
      </div>
      <div>
        <Input
          isRequired
          errorMessage="Please enter a valid email"
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="ingresa tu email"
          type="email"
        />
      </div>
      <div>
        <Input
          isRequired
          errorMessage="contraseña invalida"
          label="Contraseña"
          labelPlacement="outside"
          name="contraseña"
          type="password"
        />
      </div>
      <div>
        <Select
          isRequired
          errorMessage="Selecciona un perfil"
          label="perfiles"
          name="perfil"
        >
          {perfiles.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </Select>
      </div>
      {/* <div>
        <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
          Externo
        </Checkbox>
      </div> */}
      <div>
        <div className="flex gap-2 mx-auto">
          <div>
            <Button color="primary" type="submit">
              Crear cuenta
            </Button>
          </div>
          <div>
            <Button type="reset" variant="flat">
              Borrar
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}
