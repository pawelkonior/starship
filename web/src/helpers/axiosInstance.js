import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API from "../data/constants/api_routes.js";
import { getAuthTokens } from "./getAuthTokens.js";

let authTokens = getAuthTokens();

const axiosInstance = axios.create({
  baseURL: `/api/v1/`,
  headers: { Authorization: `Bearer ${authTokens?.access}` },
});

axiosInstance.interceptors.request.use(async (req) => {
  authTokens = getAuthTokens();
  if (authTokens?.access) {
    req.headers.Authorization = `Bearer ${authTokens.access}`;
  } else {
    delete req.headers.Authorization;
  }

  const user = authTokens?.access ? jwtDecode(authTokens?.access) : null;
  const isExpired = user?.exp < Date.now() / 1000;

  if (!isExpired) return req;

  const response = await axios.post(API.auth.token, {
    refresh: authTokens.refresh,
  });

  authTokens = response.data;
  localStorage.setItem('authTokens', JSON.stringify(authTokens));
  req.headers.Authorization = `Bearer ${authTokens.access}`;
  return req;
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
      // if (error.response.status === 401) {
      //   window.location.href = "/zaloguj-sie"
      // }
      return Promise.reject(error);
    }
)

export default axiosInstance;
