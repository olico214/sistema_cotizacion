import { cookies } from "next/headers";

const getCookie = async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("name");
  return cookie;
};
