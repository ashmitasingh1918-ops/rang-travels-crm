import { NavLink } from "react-router-dom";

function SidebarItem({ item }) {
    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded ${isActive ? "active bg-primary text-white" : "text-dark"
                }`
            }
        >
            <i className={item.icon}></i>
            <span>{item.title}</span>
        </NavLink>
    );
}

export default SidebarItem;