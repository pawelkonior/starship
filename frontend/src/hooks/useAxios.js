import axios from "axios";
import useAuth from "./useAuth";

/**
 * Hook allowing access to a better Axios, which:
 * - Fills Authorization header with Bearer token, if no Authorization header was provided.
 * - Attempts to refresh access token if response status was 403 and repeats request.
 * - TODO parses all ISO date strings to Date objects.
 * */
export default function useAxios() {
    const { token } = useAuth();
    const client = axios.create({})

    client.interceptors.request.use((config) => {
        const newConfig = { ...config };
        newConfig.headers = newConfig.headers || {};
        newConfig.headers.Authorization = newConfig.headers.Authorization || `Bearer ${token}`;
        return newConfig;
    });

    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 403 && !originalRequest.retry) {
                originalRequest.retry = true;
                originalRequest.headers.Authorization = `Bearer ${await refreshAccessToken()}`;
                return client(originalRequest);
            }
            return Promise.reject(error);
        }
    );

    return client;
}
