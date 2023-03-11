import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AppStore from "../../store/AppStore";
import { User } from "../../store/models/Models";
import UserStore from "../../store/UserStore";
import OverlayModal from "../User/Conversion/OverlayModal";
import './admin.css'
export function EditUser() {
    const navigate = useNavigate();
    const userStore = UserStore();
    const appStore = AppStore();
    const location = useLocation();

    const { id } = useParams();


    const nameRef = useRef<HTMLInputElement>(null);

    const phoneRef = useRef<HTMLInputElement>(null);

    const emailRef = useRef<HTMLInputElement>(null);

    const [isAdmin, setIsAdmin] = useState(false);
    const handleIsAdmin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAdmin(e.target.checked);
    }
    useEffect(() => {
        let u = userStore.users.find(user => user.id === id);
        emailRef.current!.value = u?.email!;
        nameRef.current!.value = u?.name!;
        phoneRef.current!.value = u?.phone!;
        setIsAdmin(u?.role === 'Admin')


    }, [location])

    const [showMessageModel, setMessageModel] = useState(false);
    const [message, setMessage] = useState('');
    const editUserDetails = async () => {
        let user = {
            id: id,
            email: emailRef.current?.value,
            name: nameRef.current?.value,
            phone: phoneRef.current?.value,
            role: isAdmin,
        };

        const res = await userStore.editUserDetails(user);
        if (res) {
            emailRef.current!.value = "";
            nameRef.current!.value = "";
            phoneRef.current!.value = "";
            setMessage(`User details updated successfully`);
            setMessageModel(true);
        }
    }

    return (<div className="newUser">
        <h2><b>Edit User Details</b></h2>

        <div className="form-input">
            <label>Name</label>
            <input ref={nameRef} type="text" placeholder="Enter User Name" required />
        </div>
        <div className="form-input">
            <label>Phone</label>
            <input ref={phoneRef} type="text" placeholder="Enter Phone" required />
        </div>
        <div className="form-input">
            <label>Email</label>
            <input ref={emailRef} type="text" placeholder="Enter Email" required />
        </div>
        <div className="form-input">

            Is Admin <input onChange={handleIsAdmin} checked={isAdmin} type="checkbox" placeholder="IsAdmin" />
        </div>
        <OverlayModal show={showMessageModel} handleClose={() => {
            setMessageModel(false);
            navigate('/admin/manage');
        }}>   <h2>{message}</h2>
        </OverlayModal>
        <button type="button" onClick={editUserDetails}>Update</button>
    </div>);
}