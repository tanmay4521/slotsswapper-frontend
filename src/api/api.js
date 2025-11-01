import axios from 'axios';

const api = axios.create({
  baseURL: 'https://slotsswapper-backend-1.onrender.com/api', // or your backend URL
});

// Intercepts requests to attach the token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// FIX: Intercepts responses to handle token expiration (401 error)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error response exists and is a 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.log("Token expired or unauthorized. Forcing logout.");
      
      // 1. Remove the expired token
      localStorage.removeItem('token');
      
      // 2. Clear any cached user data if necessary
      
      // 3. Optional: Redirect the user to the login page (root path)
      // Note: You can't use `Maps` hook here, so force a window reload.
      if (window.location.pathname !== '/') {
        window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;