import { Link, Outlet, useNavigate } from "react-router-dom";
import './navigationStyle.css'
import AppStore from '../store/AppStore';
import UserStore from '../store/UserStore';
import { useEffect } from "react";
import { removeStorageData } from "../helpers/localStorageHelper";
import { AiOutlineSearch, AiOutlineLogout } from 'react-icons/ai';

export function HomeLayout() {
    const userStore = UserStore();
    const appStore = AppStore();
    const navigate = useNavigate();
    useEffect(() => {
        userStore.updateGroups(appStore.userData?.id);

    }, [])
    const store = AppStore();
    const logout = () => {
        store.userData = null;

        removeStorageData('userdata');
        navigate('/', { replace: true });
    }
    const filterGroup = (e: any) => {
        userStore.filterGroups(e.target.value);
    }



    return (
        <>
            <div id='maincontainer'>


                <div id="sidebar">
                    <h3>Profile Details</h3>
                    <div id="profile">
                        <b> <div id="name"><p>{appStore.userData?.name}</p> <AiOutlineLogout size={30} onClick={logout} /></div>
                            <p>{appStore.userData?.email}</p>
                            <p>{appStore.userData?.phone}</p></b>

                    </div>



                    <h3>User Options</h3>
                    <nav>
                        <ul>
                            {store.isAdmin ? <><li><Link to="/admin/create">Create User</Link></li>
                                <li><Link to="/admin/manage">View User</Link></li></> : <></>

                            }
                            <li><Link to="/home/create">Create Group</Link></li>
                        </ul>
                    </nav>
                    <div>
                        <h3>Groups</h3>
                        <div id="search">
                            <input
                                id="q"
                                aria-label="Search groups"
                                placeholder="Search Groups"
                                type="search"
                                onChange={filterGroup}
                                name="q"
                            />
                        </div>
                        <ul>
                            {
                                userStore.filteredGroups.map((group) => <li><Link to={`/group/${store.userData?.id}/${group.id}`}>{group.name}</Link></li>)
                            }
                        </ul>
                    </div>
                </div>
                <div id="detail"><Outlet /></div>
            </div>
        </>
    );
}