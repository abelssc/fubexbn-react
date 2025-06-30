import axios from "axios";

const clientAxios = axios.create(
    {
        baseURL: import.meta.env.VITE_API_URL,
        withCredentials: true, 
        headers: {
            'Accept': 'application/json'
        },
    }
)


clientAxios.interceptors.response.use(
  response => {
    const { data } = response;

    // Validación de sesión cerrada
    if (typeof data === "string") {
      if (data.includes("Tu sesión ha sido cerrada") || data.includes("general/control_ingreso.php")) {
        window.location.href = "https://fuvexbn.a365.com.pe:7443/";
        return Promise.reject(new Error("Sesión cerrada")); // evita continuar
      }
    }

    return response;
  },
  error => {
    // Puedes manejar otros errores (como 500, 404, etc)
    return Promise.reject(error);
  }
);





// clientAxios.interceptors.request.use(config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = token;
//     }
//     return config;
// });
// // si el token no es valido, redirigir a login
// clientAxios.interceptors.response.use(response => response,
//     error => {
//         //401: Unauthorized - No autorizado - Token invalido o expirado 
//         if (error.response.status === 401 && error.response.config.url !== '/login') {
//             localStorage.removeItem('token');
//             window.location.href = import.meta.env.VITE_BASE_URL + '/auth/login';
//         }
//         return Promise.reject(error);
//     }
// );
/**
 * 
Request URL
    https://fuvexbn.a365.com.pe:7443/BN/GuardarProspecto_BN.php
Request Method
    POST
Status Code
    302 Found
Remote Address
    200.126.53.68:7443
Referrer Policy
    strict-origin-when-cross-origin
 */


export default clientAxios;