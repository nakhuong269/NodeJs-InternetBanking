import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:4000/api/",
  timeout: 20000,
  headers: { Authorization: `Bearer ${localStorage.App_AccessToken}` },
  // headers: { 'X-Custom-Header': 'foobar' }
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const {
      config,
      res: { status },
    } = error;
    if (status === 403) {
      // Refresh the access token
      const refreshToken = await refreshAccessToken();
      config.headers["Authorization"] = `Bearer ${refreshToken}`;
      return instance(config);
    }
    throw error;
  }
);

async function refreshAccessToken() {
  // Make a request to refresh the access token
  const { data } = await axios.post("/refresh-token");
  return data.accessToken;
}

export function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
