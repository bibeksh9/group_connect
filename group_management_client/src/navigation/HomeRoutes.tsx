import { Route, Routes, Link, Outlet } from "react-router-dom";
import { ConversionBox } from "../component/User/Conversion/ConversionBox";
import { CreateGroup } from "../component/User/CreateGroup";
import { ViewGroup } from "../component/User/ViewGroups";
import { HomeLayout } from "./HomeLayout";


export function HomeRoutes() {
    return (
        <Routes>
            <Route path='/' element={<HomeLayout />}>
                <Route index path="create" element={<CreateGroup />} />
                <Route path="manage" element={<ViewGroup />} />
            </Route>

        </Routes>
    );
}