import { storeObject } from '../helpers/localStorageHelper';
import axios from './axios';


const CreateGroupService = async (name: string, creatorId: string) => {

    try {
        let response = await axios.post('user/createGroup', { name: name, creator: creatorId });


        return response.data;
    }
    catch (e) {

    }
    return false;
}
const getAllUserGroupService = async (userId: string) => {

    try {
        let response = await axios.post('user/getUserGroups', { userId: userId });


        return response.data;
    }
    catch (e) {

    }
    return false;
}


const sendMessageService = async (message: string, user: string, group: string) => {

    try {
        let response = await axios.post('user/addMessage', { message, user, group });


        return response.data;
    }
    catch (e) {

    }
    return false;
}
const likeMessageService = async (message: string, user: string) => {

    try {
        let response = await axios.post('user/likeMessage', { message, user });


        return response.data;
    }
    catch (e) {

    }
    return false;
}
const disLikeMessageService = async (group: string) => {

    try {
        let response = await axios.delete(`user/dislikeMessage/${group}`);


        return response.data;
    }
    catch (e) {

    }
    return false;
}


const getAllGroupMessages = async (group: string) => {

    try {
        let response = await axios.get(`user/getMessages/${group}`);


        return response.data;
    }
    catch (e) {

    }
    return false;
}

const addNewGroupMember = async (email: string, groupId: string) => {

    try {
        let response = await axios.post(`user/addGroupMember`, { email: email, groupId: groupId });


        return response.data;
    }
    catch (e) {

    }
    return false;
}

const removeGroupMember = async (user: string, group: string) => {

    try {
        let response = await axios.delete(`user/removeGroupMember/${user}/${group}`);


        return response.data;
    }
    catch (e) {

    }
    return false;
}



const deleteGroupService = async (groupId: string) => {

    try {
        let response = await axios.delete(`user/deleteGroup/${groupId}`);

        return response.data;
    }
    catch (e) {

    }
    return false;
}

const searchAllMembers = async (text: string) => {

    try {
        let response = await axios.get(`user/searchAllMembers/${text}`);


        return response.data;
    }
    catch (e) {

    }
    return false;
}




export {
    CreateGroupService
    , deleteGroupService
    , getAllUserGroupService
    , sendMessageService
    , getAllGroupMessages
    , addNewGroupMember
    , likeMessageService
    , removeGroupMember
    , disLikeMessageService
    , searchAllMembers
}