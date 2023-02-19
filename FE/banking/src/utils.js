import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:4000/api/",
  timeout: 5000,
  headers: { Authorization: `Bearer ${localStorage.App_AccessToken}` },
  //headers: { "X-Custom-Header": `${localStorage.App_AccessToken}` },
});

// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     if (error.response.status === 401) {
//       const res = await axios.post(
//         "http://localhost:4000/api/account/refresh",
//         {
//           accessToken: localStorage.App_AccessToken,
//           refreshToken: localStorage.App_RefreshToken,
//         }
//       );
//       console.log(res);
//       if (res.data.success === true) {
//         console.log("Before");
//         console.log(localStorage.getItem("App_AccessToken"));
//         localStorage.setItem("App_AccessToken", res.data.accessToken);
//         console.log("After");
//         console.log(localStorage.getItem("App_AccessToken"));
//       }
//     }
//     return error;
//   }
// );

instance.interceptors.request.use(
  async (config) => {
    const access_token = localStorage.getItem("App_AccessToken");
    const refresh_token = localStorage.getItem("App_RefreshToken");

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const access_token = localStorage.getItem("App_AccessToken");
    const refresh_token = localStorage.getItem("App_RefreshToken");

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (refresh_token) {
        try {
          const response = await axios.post(
            "http://localhost:4000/api/account/refresh",
            {
              accessToken: access_token,
              refreshToken: refresh_token,
            }
          );
          const new_access_token = response.data.accessToken;
          saveTokens(new_access_token, refresh_token);
          return instance(originalRequest);
        } catch (error) {
          // handle refresh token error
        }
      }
    }

    return Promise.reject(error);
  }
);

function saveTokens(access_token, refresh_token) {
  localStorage.setItem("App_AccessToken", access_token);
  localStorage.setItem("App_RefreshToken", refresh_token);
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
