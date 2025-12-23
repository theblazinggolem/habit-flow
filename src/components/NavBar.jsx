import { NavLink } from "react-router-dom";

const NavBar = () => {
    const navItems = [
        { name: "Tasks", path: "/tasks" },
        { name: "Goals", path: "/goals" },
        { name: "Reminders", path: "/reminders" },
        { name: "Habits", path: "/habits" },
        { name: "Settings", path: "/settings" },
    ];

    return (
        <nav className="w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-indigo-600 mr-8">
                HabitFlow
            </h1>

            <div className="flex gap-6">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `text-sm font-medium transition-colors ${
                                isActive
                                    ? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
                                    : "text-gray-500 hover:text-gray-900"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </div>

            <NavLink to="/login" className="text-sm text-red-500 font-medium">
                Logout
            </NavLink>
        </nav>
    );
};

export default NavBar;
