import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Toaster} from "react-hot-toast";

import Layout from "./layout/Layout";
import Login from "./pages/auth/Login";
import ZoneMaster from "./pages/master/Zone";
import Rack from "./pages/master/Rack";
import Location from "./pages/master/Location";
import AuthRoute from "./components/auth/AuthRoute.jsx";

export default function App() {
    return (
        <>
            <Toaster position="top-right"/>
            <BrowserRouter>
                <Routes>
                    {/* 로그인 */}
                    <Route path="/login" element={<Login/>}/>

                    {/* 로그인 이후 영역 */}
                    <Route element={
                        <AuthRoute>
                            <Layout/>
                        </AuthRoute>
                    }>

                        {/* 로그인 후 최초 진입 */}
                        <Route
                            path="/"
                            element={<div className="p-4">대시보드(임시)</div>}
                        />
                        <Route path="/master/zone" element={<ZoneMaster/>}/>
                        <Route path="/master/rack" element={<Rack/>}/>
                        <Route path="/master/location" element={<Location/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

