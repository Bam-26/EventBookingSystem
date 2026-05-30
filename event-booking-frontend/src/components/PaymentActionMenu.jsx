function PaymentActionMenu({ activeSection, onChangeSection }) {
    // Defines the payment menu sections shown in the sidebar
    const sections = [
        { key: "pay", label: "Create Payment" },
        { key: "all", label: "My Payments" },
        { key: "pending", label: "Pending Payments" },
        { key: "paid", label: "Paid Payments" },
        { key: "failed", label: "Failed Payments" },
        { key: "refunded", label: "Refunded Payments" },
    ];

    return (
        <div className="bg-white border rounded shadow p-4">
            <h2 className="font-bold text-blue-600 mb-4">
                Payment Actions
            </h2>

            <div className="flex flex-col gap-2">
                {/* Renders each section as a selectable menu button */}
                {sections.map((section) => (
                    <button
                        key={section.key}
                        onClick={() => onChangeSection(section.key)}
                        className={
                            activeSection === section.key
                                ? "bg-blue-600 text-white px-4 py-2 rounded text-left"
                                : "bg-gray-100 text-gray-700 px-4 py-2 rounded text-left hover:bg-gray-200"
                        }
                    >
                        {section.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PaymentActionMenu;