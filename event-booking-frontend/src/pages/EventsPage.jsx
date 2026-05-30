import { useEffect, useState } from "react";
import { fetchEvents, addEvent, deleteEvent, editEvent, cancelEvent, closeEvent } from "../API/EventAPI";
import { fetchBookingsByEventId } from "../API/BookingAPI";
import EventList from "../components/EventList";
import EventForm from "../components/EventForm";
import EventActionMenu from "../components/EventActionMenu";


function EventsPage({ currentUser }) {
    // Stores event page data and UI state
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("create");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formMessage, setFormMessage] = useState("");

    // Stores expanded booking data for event summary and participants
    const [eventBookings, setEventBookings] = useState({});
    const [bookingMessage, setBookingMessage] = useState("");
    const [expandedSummaryEventId, setExpandedSummaryEventId] = useState(null);
    const [expandedParticipantsEventId, setExpandedParticipantsEventId] = useState(null);

    // Stores confirmation modal data before cancel, close, or delete actions
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "",
        actionType: "",
        eventId: null,
    });

    // Loads bookings for a specific event when summary or participants are opened
    const loadEventBookings = async (eventId) => {
        try {
            const result = await fetchBookingsByEventId(eventId);

            setEventBookings((prev) => ({
                ...prev,
                [eventId]: result.data,
            }));
        } catch (error) {
            setBookingMessage("Failed to load event bookings.");
            console.error(error);
        }
    };


    // Shows or hides the booking summary for the selected event
    const handleToggleSummary = async (eventId) => {
        setBookingMessage("");

        if (expandedSummaryEventId === eventId) {
            setExpandedSummaryEventId(null);
            return;
        }

        setExpandedSummaryEventId(eventId);
        setExpandedParticipantsEventId(null);
        await loadEventBookings(eventId);
    };

    // Shows or hides participant booking details for the selected event
    const handleToggleParticipants = async (eventId) => {
        setBookingMessage("");

        if (expandedParticipantsEventId === eventId) {
            setExpandedParticipantsEventId(null);
            return;
        }

        setExpandedParticipantsEventId(eventId);
        setExpandedSummaryEventId(null);
        await loadEventBookings(eventId);
    };

    // Returns events created by the current user
    const getMyEvents = () => {
        return events.filter(
            (event) => Number(event.userId) === Number(currentUser.userId)
        );
    };

    // Loads all events from the backend
    const loadEvents = async () => {
        try {
            const result = await fetchEvents();
            setEvents(result.data);
            setMessage("");
        } catch (error) {
            setMessage("Failed to load events.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Creates a new event for the current user
    const handleCreateEvent = async (event) => {
        try {
            await addEvent(currentUser.userId, event);
            setFormMessage("");
            setMessage("Event created successfully.");
            loadEvents();
        } catch (error) {
            const backendMessage =
                error.response?.data?.message || "Failed to create event.";

            setFormMessage(backendMessage);
            console.error(error);
        }
    };

    // Checks whether the selected event belongs to the current user
    const isMyEvent = (eventId) => {
        return events.some(
            (event) =>
                Number(event.eventId) === Number(eventId) &&
                Number(event.userId) === Number(currentUser.userId)
        );
    };

    // Opens confirmation modal before deleting a cancelled event
    const handleDeleteEvent = (eventId) => {
        if (!isMyEvent(eventId)) {
            setMessage("You can only manage your own events.");
            return;
        }

        openConfirmModal({
            title: "Delete Event",
            message: "Are you sure you want to delete this event? This action cannot be undone.",
            confirmText: "Delete Event",
            actionType: "delete",
            eventId,
        });
    };

    // Prepares selected event data before showing the update form
    const handleEditClick = (event) => {
        if (event.userId !== currentUser.userId) {
            setMessage("You can only update your own events.");
            return;
        }

        setSelectedEvent({
            eventId: event.eventId,
            title: event.title,
            categoryName: event.categoryName,
            description: event.description,
            eventDate: event.eventDate?.split("T")[0],
            startTime: event.startTime,
            endTime: event.endTime,
            location: event.location,
            address: event.address,
            city: event.city,
            personInCharge: event.personInCharge,
            contactPhone: event.contactPhone,
            ticketPrice: event.ticketPrice,
            maxTicket: event.maxTicket,
        });
    };

    // Updates the selected event and refreshes the event list
    const handleUpdateEvent = async (event) => {
        try {
            await editEvent(selectedEvent.eventId, event);
            setFormMessage("");
            setMessage("Event updated successfully.");
            setSelectedEvent(null);
            loadEvents();
        } catch (error) {
            const backendMessage =
                error.response?.data?.message || "Failed to update event.";

            setFormMessage(backendMessage);
            console.error(error);
        }
    };


    // Opens confirmation modal before cancelling an open event
    const handleCancelEvent = (eventId) => {
        if (!isMyEvent(eventId)) {
            setMessage("You can only manage your own events.");
            return;
        }

        openConfirmModal({
            title: "Cancel Event",
            message: "Are you sure you want to cancel this event? All related bookings may also be cancelled.",
            confirmText: "Cancel Event",
            actionType: "cancel",
            eventId,
        });
    };


    // Opens confirmation modal before closing an open event
    const handleCloseEvent = (eventId) => {
        if (!isMyEvent(eventId)) {
            setMessage("You can only manage your own events.");
            return;
        }

        openConfirmModal({
            title: "Close Event",
            message: "Are you sure you want to close this event? Users will no longer be able to book it.",
            confirmText: "Close Event",
            actionType: "close",
            eventId,
        });
    };

    // Returns badge color based on event status
    const getEventBadgeClass = (status) => {
        if (status === "Open") {
            return "bg-green-600";
        }

        if (status === "Closed") {
            return "bg-gray-700";
        }

        if (status === "Cancelled") {
            return "bg-red-600";
        }

        return "bg-blue-600";
    };

    // Filters event data based on the selected sidebar section
    const getEventsBySection = () => {
        const myEvents = getMyEvents();

        if (activeSection === "mine") {
            return myEvents;
        }

        if (activeSection === "update") {
            return myEvents.filter((event) => event.status === "Open");
        }

        if (activeSection === "cancel") {
            return myEvents.filter((event) => event.status === "Open");
        }

        if (activeSection === "close") {
            return myEvents.filter((event) => event.status === "Open");
        }

        if (activeSection === "delete") {
            return myEvents.filter((event) => event.status === "Cancelled");
        }

        return events;
    };

    // Formats backend date values to show only the date
    const formatDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        return dateString.split("T")[0];
    };

    // Opens confirmation modal with dynamic action details
    const openConfirmModal = ({ title, message, confirmText, actionType, eventId }) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            confirmText,
            actionType,
            eventId,
        });
    };

    // Resets and closes the confirmation modal
    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            confirmText: "",
            actionType: "",
            eventId: null,
        });
    };

    // Executes the selected cancel, close, or delete action after confirmation
    const handleConfirmAction = async () => {
        try {
            if (confirmModal.actionType === "cancel") {
                await cancelEvent(confirmModal.eventId);
                setMessage("Event cancelled successfully.");
            }

            if (confirmModal.actionType === "close") {
                await closeEvent(confirmModal.eventId);
                setMessage("Event closed successfully.");
            }

            if (confirmModal.actionType === "delete") {
                await deleteEvent(confirmModal.eventId);
                setMessage("Event deleted successfully.");
            }

            closeConfirmModal();
            loadEvents();
        } catch (error) {
            const backendMessage =
                error.response?.data?.message || "Action failed. Please try again.";

            setMessage(backendMessage);

            console.error(error);
            closeConfirmModal();
        }
    };

    // Loads event data when the page is first opened
    useEffect(() => {
        loadEvents();
    }, []);

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[#111827] mb-2">
                        Events
                    </h1>

                    <p className="text-sm text-[#6B7280]">
                        Create, manage, and explore available events.
                    </p>
                </div>

                {message && activeSection !== "create" && !(activeSection === "update" && selectedEvent) && (
                    <p className="mb-4 text-sm text-[#6B7280]">
                        {message}
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <EventActionMenu
                            activeSection={activeSection}
                            onChangeSection={(section) => {
                                setActiveSection(section);
                                setSelectedEvent(null);
                                setFormMessage("");
                            }}
                        />
                    </div>

                    <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        {/* Create event section */}
                        {activeSection === "create" && (
                            <EventForm
                                onSubmit={handleCreateEvent}
                                message={formMessage}
                            />
                        )}

                        {/* All events section */}
                        {activeSection === "all" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    All Events
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    Browse all events in the system.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading events...</p>
                                ) : (
                                    <EventList
                                        events={events}
                                        activeSection={activeSection}
                                    />
                                )}
                            </>
                        )}

                        {/* Owner event section with summary and participants */}
                        {activeSection === "mine" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    My Events
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    View events you created and check their booking activity.
                                </p>

                                {bookingMessage && (
                                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#EF4444]">
                                        {bookingMessage}
                                    </div>
                                )}

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading my events...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {getEventsBySection().length === 0 ? (
                                            <p className="text-[#6B7280]">No events found.</p>
                                        ) : (
                                            getEventsBySection().map((event) => {
                                                // Calculates event owner summary values from related bookings
                                                const bookings = eventBookings[event.eventId] || [];

                                                const activeBookings = bookings.filter(
                                                    (booking) => booking.status === "Active"
                                                );

                                                const pendingBookings = bookings.filter(
                                                    (booking) => booking.status === "Pending"
                                                );

                                                const cancelledBookings = bookings.filter(
                                                    (booking) => booking.status === "Cancelled"
                                                );

                                                const totalBooking = bookings.length;

                                                const totalTicketBooked = bookings.reduce(
                                                    (total, booking) => total + Number(booking.quantity),
                                                    0
                                                );

                                                const activeParticipants = activeBookings.length;
                                                const pendingBookingCount = pendingBookings.length;
                                                const cancelledBookingCount = cancelledBookings.length;

                                                const revenueEstimate = activeBookings.reduce(
                                                    (total, booking) =>
                                                        total + Number(booking.ticketPrice) * Number(booking.quantity),
                                                    0
                                                );

                                                return (
                                                    <div
                                                        key={event.eventId}
                                                        className="border border-gray-200 rounded-2xl bg-white p-5 shadow-sm"
                                                    >
                                                        <div className="flex flex-col md:flex-row md:justify-between gap-4">
                                                            <div className="w-full pr-6">
                                                                <h3 className="font-bold text-xl text-[#111827] mb-2">
                                                                    {event.title}
                                                                </h3>

                                                                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-x-6 gap-y-3 text-sm text-[#6B7280]">
                                                                    <p>
                                                                        <span className="font-medium text-[#111827]">Category:</span>{" "}
                                                                        {event.categoryName}
                                                                    </p>

                                                                    <p>
                                                                        <span className="font-medium text-[#111827]">Date:</span>{" "}
                                                                        {formatDate(event.eventDate)}
                                                                    </p>

                                                                    <p>
                                                                        <span className="font-medium text-[#111827]">City:</span>{" "}
                                                                        {event.city}
                                                                    </p>

                                                                    <p>
                                                                        <span className="font-medium text-[#111827]">Location:</span>{" "}
                                                                        <span className="break-words">{event.location}</span>
                                                                    </p>

                                                                    <p>
                                                                        <span className="font-medium text-[#111827]">Available Ticket:</span>{" "}
                                                                        {event.availableTicket}
                                                                    </p>

                                                                    <p>
                                                                        <span className="font-medium text-[#111827]">Max Ticket:</span>{" "}
                                                                        {event.maxTicket}
                                                                    </p>

                                                                    <p>
                                                                        <span className="font-medium text-[#111827]">Booked Ticket:</span>{" "}
                                                                        {Number(event.maxTicket) - Number(event.availableTicket)}
                                                                    </p>

                                                                    <p>
                                                                        <span className="font-medium text-[#111827]">Ticket Price:</span>{" "}
                                                                        RM {event.ticketPrice}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex md:flex-col gap-2 md:items-end shrink-0">
                                                                <span className="h-fit bg-[#6366F1] text-white text-xs px-4 py-1 rounded-full font-medium whitespace-nowrap">
                                                                    Owner View
                                                                </span>

                                                                <span
                                                                    className={
                                                                        event.status === "Open"
                                                                            ? "h-fit bg-[#10B981] text-white text-xs px-4 py-1 rounded-full font-medium whitespace-nowrap"
                                                                            : event.status === "Cancelled"
                                                                                ? "h-fit bg-[#EF4444] text-white text-xs px-4 py-1 rounded-full font-medium whitespace-nowrap"
                                                                                : "h-fit bg-[#6B7280] text-white text-xs px-4 py-1 rounded-full font-medium whitespace-nowrap"
                                                                    }
                                                                >
                                                                    {event.status}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-3 mt-5">
                                                            <button
                                                                onClick={() => handleToggleSummary(event.eventId)}
                                                                className="bg-[#111827] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                                                            >
                                                                {expandedSummaryEventId === event.eventId ? "Hide Summary" : "View Summary"}
                                                            </button>

                                                            <button
                                                                onClick={() => handleToggleParticipants(event.eventId)}
                                                                className="bg-[#6366F1] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                                                            >
                                                                {expandedParticipantsEventId === event.eventId ? "Hide Participants" : "View Participants"}
                                                            </button>
                                                        </div>

                                                        {expandedSummaryEventId === event.eventId && (
                                                            <div className="mt-5 border-t border-gray-200 pt-5">
                                                                <h4 className="font-bold text-[#111827] mb-3">
                                                                    Booking Summary
                                                                </h4>

                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                    <div className="border border-gray-200 rounded-xl bg-[#F9FAFB] p-4">
                                                                        <p className="text-sm text-[#6B7280]">Total Booking</p>
                                                                        <p className="text-2xl font-bold text-[#111827]">{totalBooking}</p>
                                                                    </div>

                                                                    <div className="border border-gray-200 rounded-xl bg-[#F9FAFB] p-4">
                                                                        <p className="text-sm text-[#6B7280]">Total Ticket Booked</p>
                                                                        <p className="text-2xl font-bold text-[#111827]">{totalTicketBooked}</p>
                                                                    </div>

                                                                    <div className="border border-gray-200 rounded-xl bg-[#F9FAFB] p-4">
                                                                        <p className="text-sm text-[#6B7280]">Active Participants</p>
                                                                        <p className="text-2xl font-bold text-[#10B981]">{activeParticipants}</p>
                                                                    </div>

                                                                    <div className="border border-gray-200 rounded-xl bg-[#F9FAFB] p-4">
                                                                        <p className="text-sm text-[#6B7280]">Pending Bookings</p>
                                                                        <p className="text-2xl font-bold text-[#F59E0B]">{pendingBookingCount}</p>
                                                                    </div>

                                                                    <div className="border border-gray-200 rounded-xl bg-[#F9FAFB] p-4">
                                                                        <p className="text-sm text-[#6B7280]">Cancelled Bookings</p>
                                                                        <p className="text-2xl font-bold text-[#EF4444]">{cancelledBookingCount}</p>
                                                                    </div>

                                                                    <div className="border border-gray-200 rounded-xl bg-[#F9FAFB] p-4">
                                                                        <p className="text-sm text-[#6B7280]">Revenue Estimate</p>
                                                                        <p className="text-2xl font-bold text-[#111827]">
                                                                            RM {revenueEstimate.toFixed(2)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {expandedParticipantsEventId === event.eventId && (
                                                            <div className="mt-5 border-t border-gray-200 pt-5">
                                                                <h4 className="font-bold text-[#111827] mb-3">
                                                                    Participants / Bookings
                                                                </h4>

                                                                {bookings.length === 0 ? (
                                                                    <p className="text-[#6B7280]">No participants yet.</p>
                                                                ) : (
                                                                    <div className="space-y-3">
                                                                        {bookings.map((booking) => (
                                                                            <div
                                                                                key={booking.bookingId}
                                                                                className="border border-gray-200 rounded-xl bg-[#F9FAFB] p-4"
                                                                            >
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-[#6B7280]">
                                                                                    <p>
                                                                                        <span className="font-medium text-[#111827]">Booking ID:</span>{" "}
                                                                                        {booking.bookingId}
                                                                                    </p>
                                                                                    <p>
                                                                                        <span className="font-medium text-[#111827]">User ID:</span>{" "}
                                                                                        {booking.userId}
                                                                                    </p>
                                                                                    <p>
                                                                                        <span className="font-medium text-[#111827]">Quantity:</span>{" "}
                                                                                        {booking.quantity}
                                                                                    </p>
                                                                                    <p>
                                                                                        <span className="font-medium text-[#111827]">Status:</span>{" "}
                                                                                        {booking.status}
                                                                                    </p>
                                                                                    <p>
                                                                                        <span className="font-medium text-[#111827]">Created At:</span>{" "}
                                                                                        {formatDate(booking.createdAt)}
                                                                                    </p>
                                                                                    <p>
                                                                                        <span className="font-medium text-[#111827]">Cancelled At:</span>{" "}
                                                                                        {formatDate(booking.cancelledAt ?? "-")}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Update event section */}
                        {activeSection === "update" && (
                            <>
                                {selectedEvent ? (
                                    <>
                                        <EventForm
                                            onSubmit={handleUpdateEvent}
                                            initialEvent={selectedEvent}
                                            buttonText="Update Event"
                                            message={formMessage}
                                        />

                                        <button
                                            onClick={() => setSelectedEvent(null)}
                                            className="bg-gray-200 text-[#111827] px-4 py-2 rounded-xl hover:bg-gray-300 font-medium"
                                        >
                                            Cancel Update
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                            Update My Event
                                        </h2>

                                        <p className="text-sm text-[#6B7280] mb-6">
                                            Select one of your open events to update.
                                        </p>

                                        {isLoading ? (
                                            <p className="text-[#6B7280]">Loading events...</p>
                                        ) : (
                                            <EventList
                                                events={getEventsBySection()}
                                                activeSection={activeSection}
                                                onEdit={handleEditClick}
                                            />
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {/* Cancel event section */}
                        {activeSection === "cancel" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Cancel My Event
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    Cancel one of your open events.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading events...</p>
                                ) : (
                                    <EventList
                                        events={getEventsBySection()}
                                        activeSection={activeSection}
                                        onCancel={handleCancelEvent}
                                    />
                                )}
                            </>
                        )}

                        {/* Close event section */}
                        {activeSection === "close" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Close My Event
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    Close one of your open events.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading events...</p>
                                ) : (
                                    <EventList
                                        events={getEventsBySection()}
                                        activeSection={activeSection}
                                        onClose={handleCloseEvent}
                                    />
                                )}
                            </>
                        )}

                        {/* Delete event section */}
                        {activeSection === "delete" && (
                            <>
                                <h2 className="text-2xl font-bold text-[#111827] mb-2">
                                    Delete My Event
                                </h2>

                                <p className="text-sm text-[#6B7280] mb-6">
                                    Delete events that have already been cancelled.
                                </p>

                                {isLoading ? (
                                    <p className="text-[#6B7280]">Loading events...</p>
                                ) : (
                                    <EventList
                                        events={getEventsBySection()}
                                        activeSection={activeSection}
                                        onDelete={handleDeleteEvent}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* Confirmation modal for event status and delete actions */}
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
                                    Cancel
                                </button>

                                <button
                                    onClick={handleConfirmAction}
                                    className={
                                        confirmModal.actionType === "close"
                                            ? "bg-[#111827] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                                            : "bg-[#EF4444] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                                    }
                                >
                                    {confirmModal.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EventsPage;