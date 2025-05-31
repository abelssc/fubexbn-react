import axios from "axios";

const clientAxios = axios.create(
    {
        baseURL: import.meta.env.VITE_API_URL,
        withCredentials: true, 
        headers: {
            // 'Content-Type': 'application/json',//Mejor hacemos que Axios detecte automaticamente el tipo de contenido comentando esta linea, para este caso debemos alternar entre formData o Json
            'Accept': 'application/json',
        },
    }
)
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


export default clientAxios;