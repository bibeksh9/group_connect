import axios from "axios";
import { getObject, getToken, getvalue } from "../helpers/localStorageHelper";

let instance = axios.create({
    baseURL: "http://localhost:3000/api/v1/",

});
instance.interceptors.request.use(config => {
    config.headers['authorization'] = getToken();
    return config;
});

export default instance;