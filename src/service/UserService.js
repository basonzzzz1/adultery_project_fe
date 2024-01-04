import Axios from "../config/axiosConfig";
import {LOGIN, REGISTER} from "../API/api";

const UserService = {
    login: async (user) => {
        return await Axios.post(LOGIN, user);
    },
    register: async (user) => {
        return await Axios.post(REGISTER, user);
    },
    checkLogin: async (user) => {
        return await Axios.post('/User/fail', user);
    },
}
export default UserService;