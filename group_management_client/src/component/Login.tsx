import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LoginUser } from "../services/AuthService";
import { useNavigate } from 'react-router-dom';
import './Login.css'
import AppStore from '../store/AppStore';
import { getObject, removeStorageData } from "../helpers/localStorageHelper";
export function Login() {
    const navigate = useNavigate();
    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const store = AppStore();

    useEffect(() => {

        let data = getObject('userdata');

        if (data) {
            const isTokenExpired = Date.now() >= (JSON.parse(atob(data.token.split('.')[1]))).exp * 1000

            if (isTokenExpired) {
                removeStorageData('userdata');
                navigate('/');
            }
            store.updateUserData(data);
            navigate('/home');
        }
    }, [])



    const login = async () => {
        const data = await LoginUser(username.current?.value!, password.current?.value!);
        store.updateUserData(data);
        navigate('/home');
    }


    return (

        <div className="container">
            <label ><b>Username</b></label>
            <input ref={username} type="text" placeholder="Enter Email" required />

            <label><b>Password</b></label>
            <input ref={password} type="password" placeholder="Enter Password" required />
            <button type="button" onClick={login}>Login</button>
        </div>

    );
}