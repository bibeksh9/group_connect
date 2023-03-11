import { create } from 'zustand';
import { createNewUserService, editUserDetailsService, removeUserService, viewAllUserService } from '../services/AdminService';
import {
    addNewGroupMember,
    CreateGroupService
    , deleteGroupService
    , disLikeMessageService, getAllGroupMessages, getAllUserGroupService
    , likeMessageService, removeGroupMember, searchAllMembers, sendMessageService
} from '../services/GroupService';
import { Group, Like, User } from './models/Models';


interface LoggedUserState {
    groups: Group[],
    users: User[],
    filteredGroups: Group[],
    selectedGroup: Group | undefined,
    searchedMembers: User[],

    searchMember(text: string): void;
    disLikeMessage(liked: Like): Promise<boolean>;
    editUserDetails(user: any): Promise<boolean>;
    createGroup: (data: any) => Promise<Group>
    deleteGroup: () => Promise<boolean>
    updateGroups: (data: any) => void
    updateSelectedGroup: (group: string) => void
    sentMessage: (text: string, user: string) => void
    addMember: (email: string) => Promise<boolean>
    removeMemberFromGroup: (user: string) => Promise<boolean>
    likeMessage: (message: string, user: string) => void
    filterGroups: (searchName: string) => void
    createNewUser: (data: any) => Promise<boolean>
    removeUser: (data: any) => void
    getAllUser: () => void
}

const UserStore = create<LoggedUserState>((set, get) => ({
    groups: [],
    users: [],
    filteredGroups: [],
    selectedGroup: undefined,
    searchedMembers: [],
    createGroup: async (data: any): Promise<Group> => {
        let res = await CreateGroupService(data.name, data.creator);
        set((state) => ({
            ...state,
            groups: [res.result, ...state.groups]
        }));
        return res.result;
    },
    updateGroups: async (id: any) => {
        const res = await getAllUserGroupService(id);
        set((state) => (({
            ...state,
            filteredGroups: res.result.groups,
            groups: res.result.groups
        })))
    },
    deleteGroup: async (): Promise<boolean> => {
        const state = get();
        let res = await deleteGroupService(state.selectedGroup?.id!);
        let groups = state.groups.filter(u => u.id !== state.selectedGroup?.id);
        set(() => ({
            ...state,
            groups: groups,
            filteredGroups: groups

        }))


        return true;
    },
    sentMessage: async (text: string, user: string) => {
        const state = get();
        const newMessage = await sendMessageService(text, user, state.selectedGroup!.id);
        state.selectedGroup!.messages.push(newMessage.result);
        set(() => ({
            ...state,
            selectedGroup: state.selectedGroup
        }));

    },
    updateSelectedGroup: async (group: string) => {
        const res = await getAllGroupMessages(group);
        set((state) => ({
            ...state,
            selectedGroup: res.result
        }));
    },
    addMember: async (email: string) => {
        const state = get();
        const res = await addNewGroupMember(email, state.selectedGroup!.id);

        state.selectedGroup!.users.push(res.result);
        state.searchedMembers = state.searchedMembers.filter(user => user.email !== email);

        set(() => ({
            ...state,

        }))
        return true;
    },
    removeMemberFromGroup: async (user: string) => {
        const state = get();
        const res = await removeGroupMember(user, state.selectedGroup!.id);
        state.selectedGroup!.users = res.result
        set(() => ({
            ...state,

        }))
        return true;
    },
    removeUser: async (user: string) => {
        const state = get();
        const res = await removeUserService(user);

        set(() => ({
            ...state,
            users: state.users.filter(u => u.id !== user)
        }))

    },
    likeMessage: async (message: string, user: string) => {
        const state = get();
        const newMessage = await likeMessageService(message, user);
        let likedMessage = state.selectedGroup!.messages.find(m => m.id === message);
        likedMessage?.likes.push(newMessage.result);
        set(() => ({
            ...state,
            selectedGroup: state.selectedGroup
        }));

    },
    disLikeMessage: async (like: Like) => {
        const state = get();
        const res = await disLikeMessageService(like.id);
        let likedMessage = state.selectedGroup!.messages.find(m => m.id === like.messageId)!;
        likedMessage!.likes = likedMessage?.likes.filter(l => l.id !== like.id);
        set(() => ({
            ...state,
            selectedGroup: state.selectedGroup
        }))
        return true;
    },
    filterGroups: (searchName: string) => {

        const state = get();
        let groups = state.groups.filter(g => g.name.toLowerCase().indexOf(searchName.toLowerCase()) !== -1);

        set((state) => (({
            ...state,
            filteredGroups: groups,

        })))
    },
    createNewUser: async (data: any) => {

        const res = await createNewUserService(data);

        return true;

    },
    editUserDetails: async (data: any) => {

        const res = await editUserDetailsService(data);

        return true;

    },

    getAllUser: async () => {

        const res = await viewAllUserService();

        set((state) => ({
            ...state,
            users: res.result
        }))

    },
    searchMember: async (text) => {
        const res = await searchAllMembers(text);
        set((state) => ({
            ...state,
            searchedMembers: res.result
        }))

    },


    reset: () => set((state) => ({


    }))

}));
export default UserStore;

