import axios from 'axios';

// 1. Krijimi i instancës bazë të Axios
const axiosClient = axios.create({
  // Zëvendësoje me portën e saktë të backend-it tënd (shiko launchSettings.json në .NET)
  baseURL: 'https://localhost:7049/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 2. Request Interceptor: Kujdeset për dërgimin e Token-it automatikisht
axiosClient.interceptors.request.use(
  (config) => {
    // Lexojmë token-in që kemi ruajtur në localStorage gjatë Login-it
    const token = localStorage.getItem('elitefit_token');
    
    // Nëse token-i ekziston, ia bashkëngjitim kërkesës në formatin Bearer
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Opsionale por shumë e dobishme): Menaxhon gabimet globale
axiosClient.interceptors.response.use(
  (response) => {
    // Nëse kërkesa ka kaluar me sukses, kthejmë direkt të dhënat (data)
    return response.data;
  },
  (error) => {
    // Logjika nëse backend-i kthen 401 Unauthorized (p.sh. ka skaduar token-i pas 60 minutave)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('elitefit_token');
      // Mund ta bësh redirect përdoruesin në login nëse dëshiron:
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;