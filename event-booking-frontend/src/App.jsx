import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EventsPage from "./pages/EventsPage";
import BookingsPage from "./pages/BookingsPage";
import PaymentsPage from "./pages/PaymentsPage";
import UsersPage from "./pages/UsersPage";
import AuthPage from "./pages/AuthPage";

function App() {

    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem("currentUser");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        navigate("/");
    };

    const handleUserUpdate = (updatedUser) => {
        const updated = { ...currentUser, ...updatedUser };
        setCurrentUser(updated);
        localStorage.setItem("currentUser", JSON.stringify(updated));
    };

    if (!currentUser) {
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <>
            <Navbar currentUser={currentUser} onLogout={handleLogout} />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<EventsPage currentUser={currentUser} />} />

                <Route
                    path="/users"
                    element={
                        <UsersPage
                            currentUser={currentUser}
                            onLogout={handleLogout}
                            onUserUpdate={handleUserUpdate} 
                        />
                    }
                />

                <Route path="/bookings" element={<BookingsPage currentUser={currentUser} />} />
                <Route path="/payments" element={<PaymentsPage currentUser={currentUser} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;