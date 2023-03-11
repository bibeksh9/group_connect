import { create } from 'zustand';
import { User } from './models/Models';
interface LoggedUserState {
    userData: User | null,
    token: null,
    isAdmin: boolean,
    updateUserData: (data: any) => void
}

const AppStore = create<LoggedUserState>((set) => ({
    userData: null,
    token: null,
    isAdmin: false,
    updateUserData: (data) => {
        set({
            isAdmin: data.user.role === 'Admin' ? true : false,
            token: data.token,
            userData: data.user
        })
    }
}));
export default AppStore