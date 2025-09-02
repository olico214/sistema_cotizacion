"use client";
import React, { useState } from "react";
import { Form, Input, Button } from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function FormLogin() {
  const [action, setAction] = useState(null);
  const route = useRouter();

  return (
    <Form
      className=" flex flex-col gap-4  justify-center items-center content-center"
      validationBehavior="native"
      onSubmit={async (e) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));
        // console.log(data);

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const respuesta = await response.json();

        if (respuesta.ok) {
          route.push("/inicio");
          toast.success("Bienvenido");
        } else {
          toast.error("Error al iniciar sesión");
        }
        setAction(`submit ${JSON.stringify(data)}`);
      }}
    >
      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Email"
        className="max-w-sm "
        labelPlacement="outside"
        name="email"
        variant="bordered"
        placeholder="ingresa tu email"
        type="email"
      />
      <Input
        isRequired
        errorMessage="contraseña invalida"
        className="max-w-sm"
        variant="bordered"
        label="Contraseña"
        labelPlacement="outside"
        name="contraseña"
        type="password"
      />
      <div className="flex gap-2 mx-auto">
        <div>
          <Button color="primary" type="submit">
            Iniciar sesión
          </Button>
        </div>
      </div>
    </Form>
  );
}
