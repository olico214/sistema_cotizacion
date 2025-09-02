import { cookies } from "next/headers";

export const validateCookie = async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("name");
  return cookie || null;
};
