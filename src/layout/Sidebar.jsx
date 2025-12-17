import { NavLink } from "react-router-dom";

const MenuGroup = ({ title, children }) => (
    <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2 px-3">{title}</div>
        {children}
    </div>
);

const MenuItem = ({ to, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `block px-3 py-2 rounded text-sm
       ${
                isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-700 hover:bg-gray-200"
            }`
        }
    >
        {label}
    </NavLink>
);

export default function Sidebar() {
    return (
        <aside className="w-56 bg-white border-r px-2 py-4">
            <div className="font-bold text-lg px-3 mb-6">Logistics</div>

            <MenuGroup title="Master">
                <MenuItem to="/master/zone" label="Zone" />
                <MenuItem to="/master/rack" label="Rack" />
                <MenuItem to="/master/location" label="Location" />
            </MenuGroup>

            <MenuGroup title="재고 / 작업">
                <MenuItem to="/stock/status" label="재고현황" />
            </MenuGroup>
        </aside>
    );
}
