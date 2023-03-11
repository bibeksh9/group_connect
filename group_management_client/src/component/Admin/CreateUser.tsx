import { useRef, useState } from "react";
import AppStore from "../../store/AppStore";
import UserStore from "../../store/UserStore";
import './admin.css'
export function CreateUser() {

    const userStore = UserStore();
    const appStore = AppStore();

    const nameRef = useRef<HTMLInputElement>(null);

    const phoneRef = useRef<HTMLInputElement>(null);

    const emailRef = useRef<HTMLInputElement>(null);

    const [isAdmin, setIsAdmin] = useState(false);

    const handleIsAdmin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAdmin(e.target.checked);
    }


    const makePassword = (length: number) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    const [pwd, setPwd] = useState("")
    const CreateNewUser = async () => {
        let pwd = makePassword(5);
        let user = {
            email: emailRef.current?.value,
            name: nameRef.current?.value,
            password: pwd,
            phone: phoneRef.current?.value,
            role: isAdmin,
        };

        const res = await userStore.createNewUser(user);
        if (res) {
            emailRef.current!.value = "";
            nameRef.current!.value = "";
            phoneRef.current!.value = "";
            setPwd(pwd);
        }
    }

    return (<div className="newUser">
        <h2><b>Create New User</b></h2>

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

            Is Admin <input onChange={handleIsAdmin} type="checkbox" placeholder="IsAdmin" />
        </div>
        <div className="form-input">
            {pwd !== '' ? `User Password is ${pwd}` : ''}
        </div>
        <button type="button" onClick={CreateNewUser}>Create</button>
    </div>);
}