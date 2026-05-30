import { NavLink } from "react-router-dom";

function Navbar({ currentUser, onLogout }) {
    return (
        <nav className="bg-blue-600 text-white px-6 py-4 shadow">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <h1 className="text-xl font-bold">
                    Event Booking System
                </h1>

                {/* Main navigation links for authenticated users */}
                <div className="flex gap-4 items-center">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "font-bold underline" : "hover:underline"
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/users"
                        className={({ isActive }) =>
                            isActive ? "font-bold underline" : "hover:underline"
                        }
                    >
                        Profile
                    </NavLink>

                    <NavLink
                        to="/events"
                        className={({ isActive }) =>
                            isActive ? "font-bold underline" : "hover:underline"
                        }
                    >
                        Events
                    </NavLink>

                    <NavLink
                        to="/bookings"
                        className={({ isActive }) =>
                            isActive ? "font-bold underline" : "hover:underline"
                        }
                    >
                        Bookings
                    </NavLink>

                    <NavLink
                        to="/payments"
                        className={({ isActive }) =>
                            isActive ? "font-bold underline" : "hover:underline"
                        }
                    >
                        Payments
                    </NavLink>

                    {/* Logs out the current user from the application */}
                    <button
                        onClick={onLogout}
                        className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;