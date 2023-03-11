import { Route, Routes, Link, Outlet } from "react-router-dom";
import { CreateUser } from "../component/Admin/CreateUser";
import { EditUser } from "../component/Admin/EditUser";
import { ManageUser } from "../component/Admin/ManageUser";
import { HomeLayout } from "./HomeLayout";


export function AdminRoutes() {

    return (
        <Routes>
            <Route path='/' element={<HomeLayout />}>
                <Route index path="create" element={<CreateUser />} />
                <Route path="manage" element={<ManageUser />} />
                <Route path="edit/:id" element={<EditUser />} />
            </Route>
        </Routes>
    );
}