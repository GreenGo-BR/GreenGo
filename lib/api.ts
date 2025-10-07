import axios from "axios";

export function api() {
  return axios.create({
    baseURL: process.env.REACT_APP_API_URL_PRODUCTIONS,
    headers: {
      "Content-Type": undefined,
    },
    withCredentials: false,
  });
}
