import './groupStyle.css';
import UserStore from '../../store/UserStore';
import AppStore from '../../store/AppStore';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function CreateGroup() {
    const navigate = useNavigate();
    const groupname = useRef<HTMLInputElement>(null);

    const userStore = UserStore();
    const appStore = AppStore();
    const CreateGroup = async () => {
        const group = await userStore.createGroup({ name: groupname.current?.value, creator: appStore?.userData?.id });
        navigate(`/group/${appStore.userData?.id}/${group.id}`)
    }

    return (<div className="container">
        <label ><b>Group Name</b></label>
        <input ref={groupname} type="text" placeholder="Enter Group Name" required />
        <button type="button" onClick={CreateGroup}>Create</button>
    </div>
    );
}