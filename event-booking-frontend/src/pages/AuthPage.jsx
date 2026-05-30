import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../API/UserAPI";

// Default login form values
const INITIAL_LOGIN = {
    usernameOrEmail: "",
    password: "",
};

// Default register form values
const INITIAL_REGISTER = {
    username: "",
    password: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
};

// Username must only contain letters, numbers, and underscore
const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;

// Validates password based on frontend and backend rules
const isPasswordValid = (password) => {
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return (
        password.length >= 6 &&
        password.length <= 30 &&
        hasLetter &&
        hasNumber
    );
};

function AuthPage({ onLoginSuccess }) {
    const navigate = useNavigate();

    const [mode, setMode] = useState("login");
    const [loginData, setLoginData] = useState(INITIAL_LOGIN);
    const [registerData, setRegisterData] = useState(INITIAL_REGISTER);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    // Updates the matching login field based on input name
    const handleLoginChange = (e) => {
        const { name, value } = e.target;

        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    // Updates the matching register field based on input name
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;

        setRegisterData({
            ...registerData,
            [name]: value,
        });
    };

    // Handles user login and stores the logged-in user locally
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!loginData.usernameOrEmail || !loginData.password) {
            setError("Please fill in username/email and password.");
            return;
        }

        try {
            const result = await loginUser(loginData);

            localStorage.setItem("currentUser", JSON.stringify(result.data));
            onLoginSuccess(result.data);
            navigate("/");

            setError("");
            setMessage("Login successfully.");
        } catch (error) {
            setMessage("");
            setError("Login failed. Username/email or password is incorrect.");
            console.error(error);
        }
    };

    // Handles account registration with frontend validation
    const handleRegister = async (e) => {
        e.preventDefault();

        if (
            !registerData.username ||
            !registerData.password ||
            !registerData.fullName ||
            !registerData.email ||
            !registerData.phoneNumber ||
            !registerData.dateOfBirth
        ) {
            setError("Please fill in all register fields.");
            return;
        }

        if (registerData.username.length < 3 || registerData.username.length > 20) {
            setError("Username must be between 3 and 20 characters.");
            return;
        }

        if (!USERNAME_REGEX.test(registerData.username)) {
            setError("Username can only contain letters, numbers, and underscore.");
            return;
        }

        if (!registerData.email.includes("@")) {
            setError("Email format is invalid.");
            return;
        }

        if (!isPasswordValid(registerData.password)) {
            setError("Password must be 6-30 characters and contain at least 1 letter and 1 number.");
            return;
        }

        const dob = new Date(registerData.dateOfBirth);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        if (age < 18) {
            setError("User must be at least 18 years old.");
            return;
        }

        try {
            const result = await registerUser(registerData);

            localStorage.setItem("currentUser", JSON.stringify(result.data));
            onLoginSuccess(result.data);
            navigate("/");

            setRegisterData(INITIAL_REGISTER);
            setError("");
            setMessage("Register successfully.");
        } catch (error) {
            setMessage("");
            setError("Register failed. Input may be invalid.");
            console.error(error);
        }
    };

    // Switches between login and register mode
    const switchMode = (selectedMode) => {
        setMode(selectedMode);
        setError("");
        setMessage("");
        setShowLoginPassword(false);
        setShowRegisterPassword(false);
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Left panel changes content based on selected auth mode */}
                <div className="hidden lg:flex flex-col justify-between bg-[#6366F1] p-10 text-white">
                    {mode === "login" ? (
                        <>
                            <div>
                                <p className="text-sm font-medium text-indigo-100 mb-3">
                                    Event Booking System
                                </p>

                                <h1 className="text-4xl font-bold leading-tight mb-5">
                                    Discover events, book tickets, and manage payments easily.
                                </h1>

                                <p className="text-indigo-100 leading-relaxed">
                                    Login to continue your event activity or create a new account to start booking and managing events.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mt-10">
                                <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
                                    <p className="font-bold mb-1">Browse Events</p>
                                    <p className="text-sm text-indigo-100">
                                        Explore open events and find one that interests you.
                                    </p>
                                </div>

                                <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
                                    <p className="font-bold mb-1">Create Bookings</p>
                                    <p className="text-sm text-indigo-100">
                                        Book tickets and track your booking status.
                                    </p>
                                </div>

                                <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
                                    <p className="font-bold mb-1">Manage Payments</p>
                                    <p className="text-sm text-indigo-100">
                                        Create payment records and monitor payment progress.
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <p className="text-sm font-medium text-indigo-100 mb-3">
                                    Register Guide
                                </p>

                                <h1 className="text-4xl font-bold leading-tight mb-5">
                                    Create your account with valid information.
                                </h1>

                                <p className="text-indigo-100 leading-relaxed">
                                    Follow these rules so your account can be created successfully.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mt-10">
                                <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
                                    <p className="font-bold mb-2">Username Rules</p>
                                    <ul className="text-sm text-indigo-100 space-y-1 list-disc list-inside">
                                        <li>Minimum 3 characters</li>
                                        <li>Maximum 20 characters</li>
                                        <li>Only letters, numbers, and underscore</li>
                                    </ul>
                                </div>

                                <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
                                    <p className="font-bold mb-2">Password Rules</p>
                                    <ul className="text-sm text-indigo-100 space-y-1 list-disc list-inside">
                                        <li>Minimum 6 characters</li>
                                        <li>Maximum 30 characters</li>
                                        <li>Must contain at least 1 letter</li>
                                        <li>Must contain at least 1 number</li>
                                    </ul>
                                </div>

                                <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
                                    <p className="font-bold mb-2">Age Requirement</p>
                                    <p className="text-sm text-indigo-100">
                                        User must be at least 18 years old.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 md:p-10">
                    <div className="mb-8">
                        <p className="text-sm font-medium text-[#6366F1] mb-2">
                            Welcome
                        </p>

                        <h2 className="text-3xl font-bold text-[#111827] mb-2">
                            {mode === "login" ? "Login to your account" : "Create your account"}
                        </h2>

                        <p className="text-sm text-[#6B7280]">
                            {mode === "login"
                                ? "Enter your username or email and password to continue."
                                : "Fill in your details to register a new account."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-[#F9FAFB] border border-gray-200 rounded-2xl p-2 mb-6">
                        <button
                            type="button"
                            onClick={() => switchMode("login")}
                            className={
                                mode === "login"
                                    ? "bg-[#6366F1] text-white px-4 py-3 rounded-xl font-medium shadow-sm"
                                    : "text-[#111827] px-4 py-3 rounded-xl font-medium hover:bg-gray-100"
                            }
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={() => switchMode("register")}
                            className={
                                mode === "register"
                                    ? "bg-[#6366F1] text-white px-4 py-3 rounded-xl font-medium shadow-sm"
                                    : "text-[#111827] px-4 py-3 rounded-xl font-medium hover:bg-gray-100"
                            }
                        >
                            Register
                        </button>
                    </div>

                    {message && (
                        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#10B981]">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#EF4444]">
                            {error}
                        </div>
                    )}

                    {/* Shows login form when login mode is selected */}
                    {mode === "login" && (
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[#111827] mb-2">
                                    Username or Email
                                </label>

                                <input
                                    name="usernameOrEmail"
                                    value={loginData.usernameOrEmail}
                                    onChange={handleLoginChange}
                                    placeholder="Enter username or email"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#111827] mb-2">
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showLoginPassword ? "text" : "password"}
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        placeholder="Enter password"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#6366F1] font-medium hover:underline"
                                    >
                                        {showLoginPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#6366F1] text-white px-5 py-3 rounded-xl hover:opacity-90 font-medium"
                            >
                                Login
                            </button>
                        </form>
                    )}

                    {/* Shows register form when register mode is selected */}
                    {mode === "register" && (
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-[#111827] mb-2">
                                        Username
                                    </label>

                                    <input
                                        name="username"
                                        value={registerData.username}
                                        onChange={handleRegisterChange}
                                        placeholder="Example: user_123"
                                        maxLength={20}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#111827] mb-2">
                                        Full Name
                                    </label>

                                    <input
                                        name="fullName"
                                        value={registerData.fullName}
                                        onChange={handleRegisterChange}
                                        placeholder="Enter full name"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#111827] mb-2">
                                        Email
                                    </label>

                                    <input
                                        name="email"
                                        type="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        placeholder="Enter email"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#111827] mb-2">
                                        Phone Number
                                    </label>

                                    <input
                                        name="phoneNumber"
                                        value={registerData.phoneNumber}
                                        onChange={handleRegisterChange}
                                        placeholder="Enter phone number"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#111827] mb-2">
                                        Date of Birth
                                    </label>

                                    <input
                                        name="dateOfBirth"
                                        type="date"
                                        value={registerData.dateOfBirth}
                                        onChange={handleRegisterChange}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#111827] mb-2">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showRegisterPassword ? "text" : "password"}
                                            value={registerData.password}
                                            onChange={handleRegisterChange}
                                            placeholder="6-30 chars, letter and number"
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#6366F1] font-medium hover:underline"
                                        >
                                            {showRegisterPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#6366F1] text-white px-5 py-3 rounded-xl hover:opacity-90 font-medium"
                            >
                                Register
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuthPage;