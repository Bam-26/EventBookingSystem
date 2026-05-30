import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Main welcome section with quick navigation buttons */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                    <div className="max-w-3xl">
                        <p className="text-sm font-medium text-[#6366F1] mb-2">
                            Event Booking System
                        </p>

                        <h1 className="text-4xl font-bold text-[#111827] mb-4">
                            Discover events, book tickets, and manage payments easily.
                        </h1>

                        <p className="text-[#6B7280] mb-6">
                            Browse available events, create bookings, complete payments, and keep track of your event activity in one place.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate("/events")}
                                className="bg-[#6366F1] text-white px-5 py-3 rounded-xl hover:opacity-90 font-medium"
                            >
                                Browse Events
                            </button>

                            <button
                                onClick={() => navigate("/bookings")}
                                className="bg-gray-200 text-[#111827] px-5 py-3 rounded-xl hover:bg-gray-300 font-medium"
                            >
                                My Bookings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Shows the basic event booking flow */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#6366F1] flex items-center justify-center font-bold mb-4">
                            1
                        </div>
                        <h2 className="font-bold text-[#111827] mb-2">
                            Browse Events
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                            Explore all available events and find one that interests you.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#6366F1] flex items-center justify-center font-bold mb-4">
                            2
                        </div>
                        <h2 className="font-bold text-[#111827] mb-2">
                            Create Booking
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                            Choose ticket quantity and create a booking for your selected event.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#6366F1] flex items-center justify-center font-bold mb-4">
                            3
                        </div>
                        <h2 className="font-bold text-[#111827] mb-2">
                            Make Payment
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                            Create payment records and update payment status when completed.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#6366F1] flex items-center justify-center font-bold mb-4">
                            4
                        </div>
                        <h2 className="font-bold text-[#111827] mb-2">
                            Manage Activity
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                            Track your bookings, payments, profile, and event ownership.
                        </p>
                    </div>
                </div>

                {/* Shortcut cards for the main application pages */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate("/events")}
                        className="text-left bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
                    >
                        <h2 className="font-bold text-[#111827] mb-2">
                            Events
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                            View all events or manage events you created.
                        </p>
                    </button>

                    <button
                        onClick={() => navigate("/bookings")}
                        className="text-left bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
                    >
                        <h2 className="font-bold text-[#111827] mb-2">
                            Bookings
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                            Book events and view your pending, active, or cancelled bookings.
                        </p>
                    </button>

                    <button
                        onClick={() => navigate("/payments")}
                        className="text-left bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
                    >
                        <h2 className="font-bold text-[#111827] mb-2">
                            Payments
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                            Create and manage payments for your bookings.
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;