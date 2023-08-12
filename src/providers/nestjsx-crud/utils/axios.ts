import axios, {AxiosRequestConfig} from "axios";
import {API_URL, REFRESH_TOKEN_KEY, TIME_THRESHOLD, TOKEN_EXPIRES_AT_KEY, TOKEN_KEY} from "../../../constants";

export const axiosInstance = axios.create();

const refreshAxios = axios.create();

axiosInstance.interceptors.request.use(async (request: AxiosRequestConfig) => {

    const tokenExpiresAt = parseInt(localStorage.getItem(TOKEN_EXPIRES_AT_KEY) || '0', 10);
    const currentTime = Date.now();

    if (tokenExpiresAt - currentTime <= TIME_THRESHOLD) {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        try {
            const res = await refreshAxios.post(`${API_URL}/auth/refresh`, {}, {
                headers: {
                    Authorization: 'Bearer ' + refreshToken
                }
            });

            const { token, tokenExpires } = res.data;

            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(TOKEN_EXPIRES_AT_KEY, tokenExpires);
        } catch (error) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
        }
    }

    // Retrieve the token from local storage
    const token = localStorage.getItem(TOKEN_KEY);
    // Check if the header property exists
    if (request.headers) {
        // Set the Authorization header if it exists
        request.headers["Authorization"] = `Bearer ${token}`;
    } else {
        // Create the headers property if it does not exist
        request.headers = {
            Authorization: `Bearer ${token}`,
        };
    }

    return request;
});