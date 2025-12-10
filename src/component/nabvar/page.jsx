"use client";
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/libs/auth/cookie";

export default function NavBar() {
  const route = useRouter();
  const handleCloseSesion = async () => {
    deleteCookie();
    route.push("/login");
  };

  const handleGetPerfil = () => {
    console.log("pagina azul");
    route.push("/inicio/perfil");
  };
  return (
    <Navbar className="bg-black" isBordered>
      <NavbarContent className="flex gap-4" justify="start"></NavbarContent>

      <NavbarContent className="flex gap-4" justify="center">
        <NavbarItem>
          <div className="flex gap-4">
            <Link prefetch={false} className="text-white" href="/inicio">
              Inicio
            </Link>
          </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Clave</p>
                <p className="font-semibold">email@example.com</p>
              </DropdownItem>
              <DropdownItem key="Perfil" onPress={handleGetPerfil}>
                Perfil
              </DropdownItem>

              <DropdownItem
                key="logout"
                color="danger"
                onPress={handleCloseSesion}
              >
                Cerrar Sesion
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
