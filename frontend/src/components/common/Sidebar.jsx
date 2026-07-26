import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import SidebarItem from "./SidebarItem";
import { sidebarMenu } from "../../constants/sidebarMenu";
import Logo from "./logo";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/", { replace: true });
    };

    return (
        <aside
            className="bg-white border-end vh-100 d-flex flex-column p-3"
            style={{ width: "260px" }}
        >
            <Logo />

            <div className="mt-4 d-flex flex-column gap-2">
                {sidebarMenu.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
            </div>

            <div className="mt-auto">
                <button
                    className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;