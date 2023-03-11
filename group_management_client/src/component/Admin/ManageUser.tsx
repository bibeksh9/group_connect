import { useEffect } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import AppStore from "../../store/AppStore";
import { User } from "../../store/models/Models";
import UserStore from "../../store/UserStore";
import './admin.css'


export function ManageUser() {
    const userStore = UserStore();
    const appStore = AppStore();
    const navigate = useNavigate();
    useEffect(() => {
        userStore.getAllUser();
    }, [])

    function removeMember(user: User) {

        if (confirm(`Are You sure to delete ${user.name}?`) == true) {
            userStore.removeUser(user.id);
        }
    }

    return (<div id="viewUser">
        <h2>Existing Users</h2>
        <div id="listUser">
            <table className="nostyle">
                <thead>
                    <th>Name</th>
                    <th>Email</th>
                    <th>phone</th>
                    <th></th>
                </thead>
                <tbody>
                    <tr></tr>
                    {userStore.users ? userStore.users.map((user) => {
                        return <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td><div>
                                <AiFillEdit onClick={() => {
                                    navigate(`/admin/edit/${user.id}`)
                                }} size={30} /><AiFillDelete onClick={() => {
                                    removeMember(user);
                                }} size={30} />
                            </div></td>
                        </tr>;

                    }) : <></>
                    }
                </tbody>
            </table>
        </div>
    </div>);
}