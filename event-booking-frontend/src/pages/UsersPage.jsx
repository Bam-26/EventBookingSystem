import { useEffect, useState } from "react";
import { fetchUserById, editUser, deleteUser } from "../API/UserAPI";
import UserItem from "../components/UserItem";

function UsersPage({ currentUser, onLogout }) {
    const currentUserId = currentUser.userId;

    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Stores confirmation modal data before deleting the account
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        userId: null,
    });

    // Loads the current user's profile data
    const loadUser = async () => {
        try {
            setIsLoading(true);

            const result = await fetchUserById(currentUserId);
            setUser(result.data);
            setMessage("");
        } catch (error) {
            setMessage("Failed to load user profile.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Updates the current user's profile information
    const handleUpdateUser = async (userId, user) => {
        try {
            const result = await editUser(userId, user);
            setMessage("User updated successfully.");
            onUserUpdate(result.data);  
            loadUser();
        } catch (error) {
            setMessage("Failed to update user.");
        }
    };

    // Opens confirmation modal before deleting the account
    const handleDeleteUser = (userId) => {
        setConfirmModal({
            isOpen: true,
            userId: userId,
        });
    };

    // Resets and closes the confirmation modal
    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            userId: null,
        });
    };

    // Confirms account deletion and logs the user out
    const handleConfirmDeleteUser = async () => {
        try {
            await deleteUser(confirmModal.userId);
            setMessage("User deleted successfully.");
            setUser(null);
            closeConfirmModal();
            onLogout();
        } catch (error) {
            const backendMessage =
                error.response?.data?.message ||
                "Failed to delete user. You may have active event or active booking.";

            setMessage(backendMessage);
            console.error(error);
            closeConfirmModal();
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[#111827] mb-2">
                        My Profile
                    </h1>

                    <p className="text-sm text-[#6B7280]">
                        Manage your personal information and account settings here.
                    </p>
                </div>

                {message && (
                    <p className="mb-4 text-sm text-[#EF4444]">
                        {message}
                    </p>
                )}

                {isLoading ? (
                    <p className="text-[#111827]">Loading user profile...</p>
                ) : (
                    <>
                        {user ? (
                            <UserItem
                                user={user}
                                onUpdate={handleUpdateUser}
                                onDelete={handleDeleteUser}
                            />
                        ) : (
                            <p className="text-[#111827]">No user profile found.</p>
                        )}
                    </>
                )}

                {/* Confirmation modal for account deletion */}
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200">
                            <div className="p-6">
                                <div className="w-12 h-12 rounded-full bg-red-50 text-[#EF4444] flex items-center justify-center font-bold text-xl mb-4">
                                    !
                                </div>

                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Delete Account?
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    Are you sure you want to delete your account? This action cannot be undone.
                                    Your account cannot be deleted if you still have active events or active bookings.
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeConfirmModal}
                                        className="bg-gray-200 text-[#111827] px-4 py-2 rounded-xl hover:bg-gray-300 font-medium"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleConfirmDeleteUser}
                                        className="bg-[#EF4444] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UsersPage;