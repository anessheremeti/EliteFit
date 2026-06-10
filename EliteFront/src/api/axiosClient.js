import axios from 'axios';

// ============================
// 1. Create Axios Instance
// ============================
const axiosClient = axios.create({
  baseURL: 'https://localhost:7049/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // JWT jo cookie-based
});

// ============================
// 2. REQUEST INTERCEPTOR
// ============================
axiosClient.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');

    // ============================
    // CLEAN TOKEN (FIX EXTRA QUOTES)
    // ============================
    if (token) {
      token = token
        .replace(/^"|"$/g, '') // heq quotes në fillim/fund
        .replace(/"/g, '')     // heq quotes brenda
        .trim();

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================
// 3. RESPONSE INTERCEPTOR
// ============================
axiosClient.interceptors.response.use(
  (response) => {
    // Kthen vetëm të dhënat (data) për të thjeshtuar punën në frontend
    return response.data;
  },
  (error) => {
    const status = error?.response?.status;

    // ============================
    // AUTO LOGOUT ON 401 (UNAUTHORIZED)
    // ============================
    if (status === 401) {
      console.warn('[Axios] 401 Unauthorized → Duke pastruar sesionin...');
      
      // Rregullimi: Fshihen të gjitha çelësat që përdor aplikacioni yt
      localStorage.removeItem('token');
      localStorage.removeItem('elitefit_user');

      // Ridrejto përdoruesin në login që të mos ngeci në faqe të bllokuar
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosClient;