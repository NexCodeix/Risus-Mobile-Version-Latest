import { api } from "@/lib/axios";

export const loginRequest = async (email: string, password: string) => {
  const res = await api.post("/user/obtain-token/", {
    email,
    password,
  });

  return res.data;
};
