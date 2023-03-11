import { storeObject } from '../helpers/localStorageHelper';
import axios from './axios';


const LoginUser = async (email: string, password: string) => {

    try {
        let response = await axios.post('auth/login', { email: email, password: password });
        storeObject('userdata', response.data)

        return response.data;
    }
    catch (e) {
        console.log(e);
    }
    return false;
}
const LogoutUser = () => {

}
export { LoginUser, LogoutUser }