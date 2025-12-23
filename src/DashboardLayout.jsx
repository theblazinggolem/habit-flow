import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import DatePicker from "./components/DatePicker";
import UpcomingTab from "./components/UpcomingTab";

const DashboardLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-shrink-0 z-10">
                    <NavBar />
                </div>

                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>

            <aside className="w-80 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col h-full">
                <div className="p-4 border-b border-gray-100">
                    <DatePicker />
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <UpcomingTab />
                </div>
            </aside>
        </div>
    );
};

export default DashboardLayout;
