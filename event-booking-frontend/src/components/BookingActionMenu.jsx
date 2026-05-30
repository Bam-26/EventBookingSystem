function BookingActionMenu({ activeSection, onChangeSection }) {
    // Defines the booking menu sections shown in the sidebar
    const sections = [
        { key: "book", label: "Book Event" },
        { key: "all", label: "My Bookings" },
        { key: "pending", label: "Pending Bookings" },
        { key: "active", label: "Active Bookings" },
        { key: "cancelled", label: "Cancelled Bookings" },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="mb-4">
                <h2 className="font-bold text-[#111827]">
                    Booking Actions
                </h2>

                <p className="text-sm text-[#6B7280] mt-1">
                    Choose what you want to do.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                {/* Renders each section as a selectable menu button */}
                {sections.map((section) => (
                    <button
                        key={section.key}
                        onClick={() => onChangeSection(section.key)}
                        className={
                            activeSection === section.key
                                ? "bg-[#6366F1] text-white px-4 py-3 rounded-xl text-left font-medium shadow-sm"
                                : "bg-[#F9FAFB] text-[#111827] px-4 py-3 rounded-xl text-left hover:bg-gray-100"
                        }
                    >
                        {section.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default BookingActionMenu;