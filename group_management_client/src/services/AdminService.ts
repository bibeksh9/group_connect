import { storeObject } from '../helpers/localStorageHelper';
import axios from './axios';


const createNewUserService = async (data: any) => {

    try {
        let response = await axios.post('admin/createUser', data);

        return response.data;
    }
    catch (e) {
        console.log(e);
    }
    return false;
}
const editUserDetailsService = async (data: any) => {

    try {
        let response = await axios.patch('admin/editUser', data);

        return response.data;
    }
    catch (e) {
        console.log(e);
    }
    return false;
}
const removeUserService = async (id: any) => {

    try {
        let response = await axios.delete(`admin/deleteUser/${id}`);

        return response.data;
    }
    catch (e) {
        console.log(e);
    }
    return false;
}



const viewAllUserService = async () => {

    try {
        let response = await axios.get('admin/viewUser');

        return response.data;
    }
    catch (e) {
        console.log(e);
    }
    return false;
}



export { createNewUserService, viewAllUserService, editUserDetailsService, removeUserService }