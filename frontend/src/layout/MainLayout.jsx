import Sidebar from "../components/common/Sidebar";

function MainLayout() {
    return (
        <div className="d-flex">
            <Sidebar />

            <main className="flex-grow-1 p-4">
                <h2>Welcome to Rang Travels CRM</h2>
            </main>
        </div>
    );
}

export default MainLayout;