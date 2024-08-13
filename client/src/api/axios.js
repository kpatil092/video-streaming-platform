import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`, // Base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error status is 401 (Unauthorized) and if it's not a retry
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark the request as a retry to prevent infinite loops
      // console.error('Server Response Error1:', error.response);
      try {
        // Attempt to refresh the access token only if the refresh token exists
        const refreshTokenExists = await axiosInstance.post(
          "/auth/check-refresh-token"
        );
        // console.error('Server Response Error2:', error.response);

        if (refreshTokenExists.data.exists) {
          // If refresh token exists, refresh the tokens
          const { data } = await axiosInstance.post("/auth/refresh-tokens");

          // console.error('Server Response Error3:', error.response);
          // Retry the original request with the new access token
          return axiosInstance(originalRequest);
        } else {
          // Refresh token does not exist, proceed without refreshing
          return Promise.reject(error);
        }
      } catch (err) {
        console.error("Refresh token request failed", err);

        // Remove the tokens from cookies (handled by backend)
        await axiosInstance.post("/auth/logout");

        // Optional: Redirect to login page or handle logout
        // window.location.href = '/sign-in';

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Exported functions to make HTTP requests
export const getData = async (endpoint) => {
  try {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postData = async (endpoint, data, obj) => {
  try {
    // console.log(data);
    // for (let [key, value] of data.entries()) {
    //   console.log(key, value);
    // }
    const response = await axiosInstance.post(endpoint, data, obj);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putData = async (endpoint, data) => {
  try {
    const response = await axiosInstance.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patchData = async (endpoint, data) => {
  try {
    const response = await axiosInstance.patch(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await axiosInstance.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default axiosInstance;
