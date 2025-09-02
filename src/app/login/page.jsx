"use client";
import FormLogin from "@/component/auth/login/form";
import React from "react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-gray-200 shadow-lg flex w-[720px] h-[480px] rounded-md overflow-hidden">
        <div className="flex flex-col justify-center w-full  p-8 shadow-lg bg-slate-50 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Iniciar Sesión
          </h2>
          <FormLogin />
        </div>
      </div>
    </div>
  );
}
