"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { deleteCookie } from "@/libs/auth/cookie";
import { toast } from "sonner";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import {
  FaBook,
  FaBookOpen,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaFolder,
  FaList,
  FaListAlt,
  FaMoneyBill,
  FaPencilAlt,
  FaPersonBooth,
  FaChartPie,
} from "react-icons/fa";
import { FaPeopleRoof } from "react-icons/fa6";
import { IoIosPerson, IoIosPeople } from "react-icons/io";
import BreadCrumbComponent from "../breadcrumb/breadcrumb";

import { icons } from "@/libs/icons/icons";

const NavBar = ({ children, apps, pages }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openApps, setOpenApps] = useState({});

  const handleCloseSesion = async () => {
    deleteCookie();
    toast.info("Sesión cerrada");
    router.push("/login");
  };

  const handleGetPerfil = () => {
    router.push("/inicio/perfil");
  };

  useEffect(() => {
    const isPathValid = pages.some((page) => pathname.includes(page.url));
    if (!isPathValid) {
      router.push("/inicio");
    }
  }, [pathname, router, pages]);

  useEffect(() => {
    const updatedOpenApps = apps.reduce((acc, app) => {
      const isAppActive = app.modules.some((module) =>
        pathname.includes(module.ruta)
      );
      return { ...acc, [app.name]: isAppActive };
    }, {});
    setOpenApps(updatedOpenApps);
  }, [pathname, apps]);

  const toggleApp = (appName) => {
    setOpenApps((prev) => ({
      ...prev,
      [appName]: !prev[appName],
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar className="bg-gray-900 text-white shadow-lg">
        <NavbarBrand>
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
        <NavbarContent justify="center">
          {apps.map((app) => (
            <Dropdown key={app.name}>
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="p-0 bg-transparent data-[hover=true]:bg-transparent text-white"
                    endContent={<ChevronDown size={16} />}
                    radius="sm"
                    variant="light"
                  >
                    {app.name}
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                aria-label={`App ${app.name} modules`}
                className="bg-gray-800 text-white"
              >
                {app.modules.map((module) => {
                  const IconComponent =
                    icons.find((icon) => icon.name === module.icon)
                      ?.component || FaFolder;
                  return (
                    <DropdownItem
                      key={module.ruta}
                      startContent={React.createElement(IconComponent, {
                        className: "w-5 h-5",
                      })}
                      onPress={() => router.push(`/inicio/${module.ruta}`)}
                    >
                      {module.nombre}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          ))}
        </NavbarContent>
        <NavbarContent justify="end">
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                size="lg"
                className="transition-transform"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="Perfil" onPress={handleGetPerfil}>
                <User className="mr-2" size={16} />
                Perfil
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={handleCloseSesion}
              >
                <LogOut className="mr-2" size={16} />
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      {/* Contenido principal */}
      <div className="flex-1 bg-white p-6">
        <div className="container mx-auto mt-5">
          <div className="m-10">
            <BreadCrumbComponent />
          </div>
          <div className="text-gray-800">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
