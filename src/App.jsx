import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import ZoneMaster from "./pages/master/Zone";
import Rack from "./pages/master/Rack";
import Location from "./pages/master/Zone";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<div className="p-4">대시보드(임시)</div>} />
                    <Route path="/master/zone" element={<ZoneMaster />} />
                    <Route path="/master/rack" element={<Rack />} />
                    <Route path="/master/location" element={<Location />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
