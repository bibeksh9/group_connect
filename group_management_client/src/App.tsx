import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { Login } from './component/Login'
import { AdminRoutes } from './navigation/AdminRoutes'
import { HomeRoutes } from './navigation/HomeRoutes'
import './App.css';
import AuthGaurd from './navigation/ProtectRoute'
import { HomeLayout } from './navigation/HomeLayout'
import { ConversionBox } from './component/User/Conversion/ConversionBox'

function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<AuthGaurd />}>
          <Route path='/home/*' element={<HomeRoutes />} />
          <Route path='/group' element={<HomeLayout />}>
            <Route path=":user/:id" element={<ConversionBox />} />
          </Route>
          <Route path='/admin/*' element={<AdminRoutes />} />
        </Route>
      </Routes>



    </>
  )
}

export default App
