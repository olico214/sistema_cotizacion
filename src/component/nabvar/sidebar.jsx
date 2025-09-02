"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { deleteCookie } from "@/libs/auth/cookie";
import { toast } from "sonner";
import { Menu, X, LogOut } from "lucide-react";
import { FaFolder } from "react-icons/fa";
import BreadCrumbComponent from "../breadcrumb/breadcrumb";
import { icons } from "@/libs/icons/icons";

const Sidebar = ({ children, apps, pages, email }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openApps, setOpenApps] = useState({});
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  useEffect(() => {
    const isPathValid = pages.some((page) => pathname.includes(`/inicio${page.url}`));
    if (!isPathValid) router.push("/inicio");
  }, [pathname, pages, router]);

  useEffect(() => {
    const updated = apps.reduce((acc, app) => {
      const isActive = app.modules.some((module) => pathname.includes(module.ruta));
      return { ...acc, [app.name]: isActive };
    }, {});
    setOpenApps(updated);
  }, [pathname, apps]);

  const handleLogout = () => {
    deleteCookie();
    toast.info("Sesión cerrada");
    router.push("/login");
  };

  const toggleApp = (name) => {
    setOpenApps((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden text-white"
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-xl font-bold">Mi App</h1>
        </div>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              size="sm"
              className="transition-transform"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Opciones de perfil" variant="flat">
            <DropdownItem key="perfil" onPress={() => router.push("/inicio/perfil")}>
              Perfil
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={handleLogout}>
              <LogOut className="inline-block mr-2" size={16} /> Cerrar Sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`bg-gray-900 text-white w-64 lg:translate-x-0 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:block fixed top-12 bottom-0 z-40`}
        >
          <nav className="flex flex-col h-full p-4">
            <button
              className="self-end mb-4 p-2 text-gray-400 hover:text-white transition lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
            <div className="mt-4 overflow-auto">
              <ul className="space-y-4">
                {apps.map((app) => (
                  <li key={app.name}>
                    <button
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800"
                      onClick={() => toggleApp(app.name)}
                    >
                      <FaFolder /> {app.name}
                    </button>
                    {openApps[app.name] && (
                      <ul className="ml-4 mt-2 space-y-1">
                        {app.modules.map((mod) => {
                          const Icon = icons.find((i) => i.name === mod.icon)?.component || FaFolder;
                          return (
                            <li key={mod.ruta}>
                              <Link
                                href={`/inicio/${mod.ruta}`}
                                className={`flex items-center gap-2 px-2 py-1 rounded-lg text-sm transition-all
                                  ${pathname === `/inicio${mod.ruta}` ? "bg-white text-black" : "text-gray-300 hover:bg-gray-800"}`}
                              >
                                <Icon className="w-4 h-4" />
                                {mod.nombre}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="hidden lg:block mb-6">
              <BreadCrumbComponent />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
