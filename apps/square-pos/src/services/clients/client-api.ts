import axios from "axios";

function createClientApi() {
  return axios.create({
    baseURL: "",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}

export const clientApi = createClientApi();
