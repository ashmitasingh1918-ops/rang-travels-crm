import SidebarItem from "./SidebarItem";
import { sidebarMenu } from "../../constants/sidebarMenu";
import Logo from "./logo";

function Sidebar() {
    return (
        <aside
            className="bg-white border-end vh-100 p-3"
            style={{ width: "260px" }}
        >
            <Logo />

            <div className="mt-4 d-flex flex-column gap-2">
                {sidebarMenu.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
            </div>
        </aside>
    );
}

export default Sidebar;