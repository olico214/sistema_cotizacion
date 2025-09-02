"use server"
import { cookies } from "next/headers"

export const CreateCookie = async (id) => {
    const setCookie = await cookies()
    setCookie.set('name', id)
    return
}

export const deleteCookie = async () => {
    const setCookie = await cookies()
    setCookie.delete('name')
    return
}