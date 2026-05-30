function EventActionMenu({ activeSection, onChangeSection }) {
    // Defines the event menu sections shown in the sidebar
    const sections = [
        { key: "create", label: "Create Event" },
        { key: "all", label: "All Events" },
        { key: "mine", label: "My Events" },
        { key: "update", label: "Update My Event" },
        { key: "cancel", label: "Cancel My Event" },
        { key: "close", label: "Close My Event" },
        { key: "delete", label: "Delete My Event" },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="mb-4">
                <h2 className="font-bold text-[#111827]">
                    Event Actions
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

export default EventActionMenu;