import axios from "axios";
import { cookies } from "next/headers";

export async function getServerApi() {
  const cookieStore = await cookies();

  return axios.create({
    baseURL: process.env.NEXTAUTH_URL,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    withCredentials: true,
  });
}

// export const serverApi = await createServerApi();
