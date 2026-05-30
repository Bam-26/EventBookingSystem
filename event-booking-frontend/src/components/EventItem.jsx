function EventItem({ event, activeSection, onEdit, onDelete, onCancel, onClose }) {
    // Returns badge color based on event status
    const getEventBadgeClass = (status) => {
        if (status === "Open") {
            return "bg-[#10B981]";
        }

        if (status === "Closed") {
            return "bg-[#374151]";
        }

        if (status === "Cancelled") {
            return "bg-[#EF4444]";
        }

        return "bg-[#6366F1]";
    };

    // Formats backend date values to show only the date
    const formatDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        return dateString.split("T")[0];
    };

    return (
        <div className="relative border border-gray-200 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                    <h3 className="font-bold text-xl text-[#111827] mb-3">
                        {event.title}
                    </h3>

                    {/* Fixed columns keep event details aligned across cards */}
                    <div className="grid grid-cols-1 md:grid-cols-[260px_260px_1fr] gap-x-8 gap-y-5 text-sm text-[#6B7280]">
                        <div>
                            <p className="font-medium text-[#111827] mb-1">Category:</p>
                            <p>{event.categoryName}</p>
                        </div>

                        <div>
                            <p className="font-medium text-[#111827] mb-1">Date:</p>
                            <p>{formatDate(event.eventDate)}</p>
                        </div>

                        <div>
                            <p className="font-medium text-[#111827] mb-1">City:</p>
                            <p>{event.city}</p>
                        </div>

                        <div>
                            <p className="font-medium text-[#111827] mb-1">Location:</p>
                            <p className="break-words">{event.location}</p>
                        </div>

                        <div>
                            <p className="font-medium text-[#111827] mb-1">Available Ticket:</p>
                            <p>{event.availableTicket}</p>
                        </div>

                        <div>
                            <p className="font-medium text-[#111827] mb-1">Ticket Price:</p>
                            <p>RM {event.ticketPrice}</p>
                        </div>
                    </div>
                </div>

                <span
                    className={`${getEventBadgeClass(event.status)} h-fit text-white text-xs px-3 py-1 rounded-full font-medium`}
                >
                    {event.status}
                </span>
            </div>

            {/* Shows the correct action button based on the selected event section */}
            {(activeSection === "update" ||
                activeSection === "cancel" ||
                activeSection === "close" ||
                activeSection === "delete") && (
                    <div className="mt-5 pt-4 border-t border-gray-200">
                        {activeSection === "update" && (
                            <button
                                onClick={() => onEdit(event)}
                                className="bg-[#F59E0B] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                            >
                                Edit Event
                            </button>
                        )}

                        {activeSection === "cancel" && (
                            <button
                                onClick={() => onCancel(event.eventId)}
                                className="bg-[#EF4444] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                            >
                                Cancel Event
                            </button>
                        )}

                        {activeSection === "close" && (
                            <button
                                onClick={() => onClose(event.eventId)}
                                className="bg-[#374151] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                            >
                                Close Event
                            </button>
                        )}

                        {activeSection === "delete" && (
                            <button
                                onClick={() => onDelete(event.eventId)}
                                className="bg-[#EF4444] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                            >
                                Delete Event
                            </button>
                        )}
                    </div>
                )}
        </div>
    );
}

export default EventItem;