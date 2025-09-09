"use server"
import { redirect } from "next/navigation"

export const handleCloseSesionServer = async () => {
    redirect("/login")
}