import { useState } from "react";

function BookingEventCard({ event, onPayNow, onPayLater }) {
    // Controls the booking form state inside the event card
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");

    // Calculates the total price based on selected quantity
    const totalPrice = Number(event.ticketPrice) * Number(quantity);

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    // Validates ticket quantity before creating a booking
    const validateQuantity = () => {
        if (!quantity || Number(quantity) <= 0) {
            setError("Quantity must be more than 0.");
            return false;
        }

        if (Number(quantity) > event.availableTicket) {
            setError("Quantity cannot be more than available ticket.");
            return false;
        }

        setError("");
        return true;
    };

    // Creates a booking without redirecting to payment
    const handlePayLater = () => {
        if (!validateQuantity()) {
            return;
        }

        onPayLater(event.eventId, Number(quantity));
        setIsBookingOpen(false);
        setQuantity(1);
    };

    // Creates a booking and continues directly to payment
    const handlePayNow = () => {
        if (!validateQuantity()) {
            return;
        }

        onPayNow(event.eventId, Number(quantity));
        setIsBookingOpen(false);
        setQuantity(1);
    };

    return (
        <div className="border border-gray-200 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                    <h3 className="font-bold text-xl text-[#111827] mb-3">
                        {event.title}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#6B7280]">
                        <p>
                            <span className="font-medium text-[#111827]">Category:</span>{" "}
                            {event.categoryName}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Date:</span>{" "}
                            {event.eventDate?.split("T")[0]}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">City:</span>{" "}
                            {event.city}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Location:</span>{" "}
                            {event.location}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Available Ticket:</span>{" "}
                            {event.availableTicket}
                        </p>

                        <p>
                            <span className="font-medium text-[#111827]">Ticket Price:</span>{" "}
                            RM {event.ticketPrice}
                        </p>
                    </div>
                </div>

                <span className="h-fit bg-[#10B981] text-white text-xs px-3 py-1 rounded-full font-medium">
                    {event.status}
                </span>
            </div>

            {!isBookingOpen && (
                <button
                    onClick={() => setIsBookingOpen(true)}
                    className="mt-5 bg-[#6366F1] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                >
                    Book Now
                </button>
            )}

            {/* Shows the booking form only after the user clicks Book Now */}
            {isBookingOpen && (
                <div className="mt-5 border-t border-gray-200 pt-5">
                    <label className="block text-sm font-medium text-[#111827] mb-2">
                        Quantity
                    </label>

                    <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={event.availableTicket}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                    />

                    {error && (
                        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#EF4444]">
                            {error}
                        </div>
                    )}

                    <div className="mt-4 rounded-xl bg-[#F9FAFB] border border-gray-200 p-4">
                        <p className="text-sm text-[#6B7280]">
                            Total Price
                        </p>

                        <p className="text-2xl font-bold text-[#111827]">
                            RM {totalPrice.toFixed(2)}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                        <button
                            onClick={handlePayLater}
                            className="bg-[#111827] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                        >
                            Pay Later
                        </button>

                        <button
                            onClick={handlePayNow}
                            className="bg-[#6366F1] text-white px-4 py-2 rounded-xl hover:opacity-90 font-medium"
                        >
                            Pay Now
                        </button>

                        <button
                            onClick={() => {
                                setIsBookingOpen(false);
                                setError("");
                                setQuantity(1);
                            }}
                            className="bg-gray-200 text-[#111827] px-4 py-2 rounded-xl hover:bg-gray-300 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookingEventCard;