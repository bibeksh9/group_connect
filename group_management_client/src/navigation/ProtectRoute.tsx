import React, { Component } from 'react';
import { Navigate, Outlet, Route } from "react-router-dom";
import AppStore from '../store/AppStore';
const AuthGaurd = () => {
    const store = AppStore();

    return store.userData ? <Outlet /> : <Navigate to="/" />


}

export default AuthGaurd