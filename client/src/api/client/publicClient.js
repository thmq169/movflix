import axios from "axios";
import queryString from "query-string";

const backendUrl = "https://movflix-api.vercel.app/api/";

const publicClient = axios.create({
  baseURL: backendUrl,
  paramsSerializer: (param) => queryString.stringify({ param }),
});

publicClient.interceptors.request.use((config) => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
    },
  };
});

publicClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (err) => {
    if (!err.response) {
      return alert(err);
    }

    throw err.response.data;
  }
);

export default publicClient;
