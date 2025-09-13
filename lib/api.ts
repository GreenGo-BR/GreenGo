import axios from "axios";

export function api() {
  return axios.create({
    baseURL: "http://localhost:5000/api/",
    headers: {
      "Content-Type": undefined,
    },
  });
}
