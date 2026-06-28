import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/', // backend ka base URL
});


//automatically attach jwt token
api.interceptors.request.use( // ye kya krega 
    (config)=>{
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

// Ye kaise kaam karta hai?

// Har request se pehle Axios yahan aayega.

// Favorite Click
//       ↓
// api.post("/favorites")
//       ↓
// Interceptor
//       ↓
// localStorage se Token
//       ↓
// Authorization Header
//       ↓
// Backend

// Backend ko automatically ye milega:

// Authorization: Bearer eyJhbGc......

// Ab middleware bhi satisfy ho jayega.



export default api;