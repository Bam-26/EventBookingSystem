import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../API/EventAPI";
import { addBooking, fetchBookingsByUserId, cancelBooking } from "../API/BookingAPI";
import BookingEventCard from "../components/BookingEventCard";
import BookingActionMenu from "../components/BookingActionMenu";

function BookingsPage({ currentUser }) {
    const userId = currentUser.userId;

    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("book");
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [allEvents, setAllEvents] = useState([]);
    const [openEvents, setOpenEvents] = useState([]);

    // Loads all events and current user's bookings
    const loadData = async () => {
        try {
            setIsLoading(true);

            const eventResult = await fetchEvents();
            const bookingResult = await fetchBookingsByUserId(userId);

            const openEventsData = eventResult.data.filter(
                (event) => event.status === "Open"
            );

            setAllEvents(eventResult.data);
            setOpenEvents(openEventsData);
            setBookings(bookingResult.data);
            setMessage("");
        } catch (error) {
            setMessage("Failed to load booking data.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Stores confirmation modal data before cancelling a booking
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "",
        bookingId: null,
    });

    // Opens the confirmation modal with dynamic booking action details
    const openConfirmModal = ({ title, message, confirmText, bookingId }) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            confirmText,
            bookingId,
        });
    };

    // Resets and closes the confirmation modal
    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            confirmText: "",
            bookingId: null,
        });
    };

    // Creates the booking payload required by the backend
    const createBooking = async (eventId, quantity) => {
        const booking = {
            eventId: eventId,
            quantity: quantity,
        };

        const result = await addBooking(userId, booking);
        return result.data;
    };

    // Creates a booking and keeps it as pending payment
    const handlePayLater = async (eventId, quantity) => {
        try {
            await createBooking(eventId, quantity);
            setMessage("Booking created successfully. You can pay later.");
            loadData();
        } catch (error) {
            setMessage("Failed to create booking.");
            console.error(error);
        }
    };

    // Creates a booking and redirects user to the payment page
    const handlePayNow = async (eventId, quantity) => {
        try {
            const booking = await createBooking(eventId, quantity);
            setMessage(`Booking created successfully. Please continue payment for Booking ID ${booking.bookingId}.`);
            loadData();
            navigate(`/payments?bookingId=${booking.bookingId}`);
        } catch (error) {
            setMessage("Failed to create booking.");
            console.error(error);
        }
    };

    // Redirects pending booking to payment page
    const handleGoToPayment = (bookingId) => {
        navigate(`/payments?bookingId=${bookingId}`);
    };

    // Opens confirmation modal before cancelling a booking
    const handleCancelBooking = (bookingId) => {
        openConfirmModal({
            title: "Cancel this booking?",
            message: "This booking will be cancelled. Any completed payment for this booking may be refunded.",
            confirmText: "Cancel Booking",
            bookingId,
        });
    };

    // Filters bookings based on the selected sidebar section
    const getDisplayedBookings = () => {
        if (activeSection === "pending") {
            return bookings.filter((booking) => booking.status === "Pending");
        }

        if (activeSection === "active") {
            return bookings.filter((booking) => booking.status === "Active");
        }

        if (activeSection === "cancelled") {
            return bookings.filter((booking) => booking.status === "Cancelled");
        }

        return bookings;
    };

    // Formats backend date values to show only the date
    const formatDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        return dateString.split("T")[0];
    };

    // Returns badge color based on booking status
    const getBookingBadgeClass = (status) => {
        if (status === "Active") {
            return "bg-[#10B981]";
        }

        if (status === "Pending") {
            return "bg-[#F59E0B]";
        }

        if (status === "Cancelled") {
            return "bg-[#EF4444]";
        }

        return "bg-[#6366F1]";
    };

    // Matches booking event ID with event title for display
    const getEventTitleById = (eventId) => {
        const event = allEvents.find(
            (event) => Number(event.eventId) === Number(eventId)
        );

        return event ? event.title : "Unknown Event";
    };

    // Renders a reusable booking card for each booking section
    const renderBookingCard = (booking) => (
        <div
            key={booking.bookingId}
            className="border border-gray-200 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition"
        >
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                    <h3 className="font-bold text-xl text-[#111827] mb-3">
                        Booking ID: {booking.bookingId}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#6B7280]">
                        <p>
                            <span className="font-medium text-[#111827]">Booking Code:</span>{" "}
                            {booking.bookingCode}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Event:</span>{" "}
                            {getEventTitleById(booking.eventId)}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Quantity:</span>{" "}
                            {booking.quantity}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Ticket Price:</span>{" "}
                            RM {booking.ticketPrice}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Created At:</span>{" "}
                            {formatDate(booking.createdAt)}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Cancelled At:</span>{" "}
                            {formatDate(booking.cancelledAt)}
                        </p>
                    </div>
                </div>

                <span
                    className={`${getBookingBadgeClass(booking.status)} h-fit text-white text-xs px-3 py-1 rounded-full font-medium`}
                >
                    {booking.status}
                </span>
            </div>

            {(booking.status === "Pending" || booking.status === "Active") && (
                <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-200">
                    {booking.status === "Pending" && (
                        <button
                            onClick={() => handleGoToPayment(booking.bookingId)}
                            className="bg-[#6366F1] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                        >
                            Pay Now
                        </button>
                    )}

                    <button
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        className="bg-[#EF4444] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                    >
                        Cancel Booking
                    </button>
                </div>
            )}
        </div>
    );

    // Confirms booking cancellation and refreshes booking data
    const handleConfirmCancelBooking = async () => {
        try {
            const result = await cancelBooking(confirmModal.bookingId);
            const updatedBooking = result.data;

            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking.bookingId === updatedBooking.bookingId
                        ? updatedBooking
                        : booking
                )
            );

            setMessage("Booking cancelled successfully.");
            closeConfirmModal();

            await loadData();
        } catch (error) {
            const backendMessage =
                error.response?.data?.message || "Failed to cancel booking.";

            setMessage(backendMessage);

            if (backendMessage === "Booking is already cancelled.") {
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking.bookingId === confirmModal.bookingId
                            ? {
                                ...booking,
                                status: "Cancelled",
                                cancelledAt: new Date().toISOString(),
                            }
                            : booking
                    )
                );

                await loadData();
            }

            console.error(error);
            closeConfirmModal();
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[#111827] mb-2">
                        Bookings
                    </h1>

                    <p className="text-sm text-[#6B7280]">
                        Book events and manage your booking status.
                    </p>
                </div>

                {message && (
                    <p className="mb-4 text-sm text-[#6B7280]">
                        {message}
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <BookingActionMenu
                            activeSection={activeSection}
                            onChangeSection={setActiveSection}
                        />
                    </div>

                    <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        {activeSection === "book" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Book Event
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    Browse open events and create a new booking.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading open events...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {openEvents.length === 0 ? (
                                            <p className="text-[#6B7280]">
                                                No open events available for booking.
                                            </p>
                                        ) : (
                                            openEvents.map((event) => (
                                                <BookingEventCard
                                                    key={event.eventId}
                                                    event={event}
                                                    onPayLater={handlePayLater}
                                                    onPayNow={handlePayNow}
                                                />
                                            ))
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {activeSection === "all" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    My Bookings
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    View all bookings you have created.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading bookings...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {getDisplayedBookings().length === 0 ? (
                                            <p className="text-[#6B7280]">No bookings found.</p>
                                        ) : (
                                            getDisplayedBookings().map((booking) =>
                                                renderBookingCard(booking)
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {activeSection === "pending" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Pending Bookings
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    Complete payment or cancel your pending bookings.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading pending bookings...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {getDisplayedBookings().length === 0 ? (
                                            <p className="text-[#6B7280]">
                                                No pending bookings found.
                                            </p>
                                        ) : (
                                            getDisplayedBookings().map((booking) =>
                                                renderBookingCard(booking)
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {activeSection === "active" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Active Bookings
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    View your confirmed bookings.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading active bookings...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {getDisplayedBookings().length === 0 ? (
                                            <p className="text-[#6B7280]">
                                                No active bookings found.
                                            </p>
                                        ) : (
                                            getDisplayedBookings().map((booking) =>
                                                renderBookingCard(booking)
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {activeSection === "cancelled" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Cancelled Bookings
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    View your cancelled booking history.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading cancelled bookings...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {getDisplayedBookings().length === 0 ? (
                                            <p className="text-[#6B7280]">
                                                No cancelled bookings found.
                                            </p>
                                        ) : (
                                            getDisplayedBookings().map((booking) =>
                                                renderBookingCard(booking)
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Confirmation modal for booking cancellation */}
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200">
                            <div className="p-6">
                                <div className="w-12 h-12 rounded-full bg-red-50 text-[#EF4444] flex items-center justify-center font-bold text-xl mb-4">
                                    !
                                </div>

                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    {confirmModal.title}
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    {confirmModal.message}
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeConfirmModal}
                                        className="bg-gray-200 text-[#111827] px-4 py-2 rounded-xl hover:bg-gray-300 font-medium"
                                    >
                                        Keep Booking
                                    </button>

                                    <button
                                        onClick={handleConfirmCancelBooking}
                                        className="bg-[#EF4444] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                                    >
                                        {confirmModal.confirmText}
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

export default BookingsPage;