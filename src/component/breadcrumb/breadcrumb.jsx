"use client";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BreadCrumbComponent() {
  const path = usePathname();

  // Divide el path en segmentos
  const segments = path.split("/").filter((segment) => segment !== "");

  const breadcrumbItems = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label =
      index === 0
        ? "Inicio"
        : segment.charAt(0).toUpperCase() + segment.slice(1);
    return (
      <BreadcrumbItem key={href}>
        <Link href={href}>{label}</Link>
      </BreadcrumbItem>
    );
  });

  return <Breadcrumbs className="p-5 shadow-md">{breadcrumbItems}</Breadcrumbs>;
}
