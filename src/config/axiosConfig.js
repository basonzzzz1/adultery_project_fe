import axios from "axios";

const Axios = axios.create({
    baseURL: 'http://localhost:8080',
});

Axios.interceptors.request.use(config => {
    const userToken = localStorage.getItem("userToken") == null ? {} : localStorage.getItem("userToken");
    console.log("userToken:", userToken);
    if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
        console.log("Authorization header set:", config.headers.Authorization);
    }
    return config;
});
export default Axios;