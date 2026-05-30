import { useState } from "react";

function UserItem({ user, onUpdate, onDelete }) {
    // Controls whether the profile card is in view mode or edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Stores editable user fields before they are submitted
    const [editedUser, setEditedUser] = useState({
        username: user.username,
        password: "",
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth?.split("T")[0],
    });

    // Formats backend date values to show only the date
    const formatDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        return dateString.split("T")[0];
    };

    // Updates the matching user field based on input name
    const handleChange = (e) => {
        const { name, value } = e.target;

        setEditedUser({
            ...editedUser,
            [name]: value,
        });
    };

    const handleSave = () => {
        // Password is optional during profile update
        if (
            !editedUser.username ||
            !editedUser.fullName ||
            !editedUser.email ||
            !editedUser.phoneNumber ||
            !editedUser.dateOfBirth
        ) {
            setError("Please fill in all user fields.");
            return;
        }

        if (!editedUser.email.includes("@")) {
            setError("Email format is invalid.");
            return;
        }

        if (editedUser.password && editedUser.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setError("");
        onUpdate(user.userId, editedUser);
        setIsEditing(false);
    };

    // Restores original values and exits edit mode
    const handleCancel = () => {
        setEditedUser({
            username: user.username,
            password: "",
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth?.split("T")[0],
        });

        setError("");
        setShowPassword(false);
        setIsEditing(false);
    };

    // Shows editable profile form when edit mode is active
    if (isEditing) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-[#6366F1] px-6 py-5">
                    <h2 className="text-2xl font-bold text-white">
                        Edit Profile
                    </h2>
                    <p className="text-indigo-100 text-sm mt-1">
                        Update your personal information below.
                    </p>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#EF4444]">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">
                                Username
                            </label>
                            <input
                                name="username"
                                value={editedUser.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">
                                New Password
                            </label>

                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={editedUser.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current password"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#6366F1] font-medium hover:underline"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111827] mb-2">
                                Full Name
                            </label>
                            <input
                                name="fullName"
                                value={editedUser.fullName}
                                onChange={handleChange}
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
                                value={editedUser.email}
                                onChange={handleChange}
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
                                value={editedUser.phoneNumber}
                                onChange={handleChange}
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
                                value={editedUser.dateOfBirth}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleSave}
                            className="bg-[#6366F1] text-white px-5 py-3 rounded-xl hover:opacity-90 font-medium"
                        >
                            Save Changes
                        </button>

                        <button
                            onClick={handleCancel}
                            className="bg-gray-200 text-[#111827] px-5 py-3 rounded-xl hover:bg-gray-300 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Shows profile information when edit mode is inactive
    return (
        <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-[#6366F1] p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white text-[#4F46E5] flex items-center justify-center text-2xl font-bold border-4 border-[#7C3AED]">
                            {user.fullName
                                ?.split(" ")
                                .map((name) => name[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {user.fullName}
                            </h2>

                            <p className="text-indigo-100">
                                Personal Account
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-white text-[#4F46E5] px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
                        >
                            Edit Profile
                        </button>

                        <button
                            onClick={() => onDelete(user.userId)}
                            className="bg-[#EF4444] text-white px-4 py-2 rounded-lg hover:opacity-90 font-medium"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-lg font-bold text-[#111827] mb-4">
                    Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB]">
                        <p className="text-sm text-[#6B7280] mb-1">
                            Full Name
                        </p>
                        <p className="font-semibold text-[#111827]">
                            {user.fullName}
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB]">
                        <p className="text-sm text-[#6B7280] mb-1">
                            Username
                        </p>
                        <p className="font-semibold text-[#111827]">
                            {user.username}
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB]">
                        <p className="text-sm text-[#6B7280] mb-1">
                            Email
                        </p>
                        <p className="font-semibold text-[#111827]">
                            {user.email}
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB]">
                        <p className="text-sm text-[#6B7280] mb-1">
                            Phone Number
                        </p>
                        <p className="font-semibold text-[#111827]">
                            {user.phoneNumber}
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB]">
                        <p className="text-sm text-[#6B7280] mb-1">
                            Date of Birth
                        </p>
                        <p className="font-semibold text-[#111827]">
                            {formatDate(user.dateOfBirth)}
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB]">
                        <p className="text-sm text-[#6B7280] mb-1">
                            Joined Date
                        </p>
                        <p className="font-semibold text-[#111827]">
                            {formatDate(user.createdAt)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserItem;