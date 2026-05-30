import { useEffect, useState } from "react";

// Default event form values used for create mode and reset
const INITIAL_EVENT = {
    title: "",
    categoryName: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    address: "",
    city: "",
    personInCharge: "",
    contactPhone: "",
    ticketPrice: "",
    maxTicket: "",
};

function EventForm({
    onSubmit,
    initialEvent = INITIAL_EVENT,
    buttonText = "Create Event",
    message = "",
}) {
    const [event, setEvent] = useState(initialEvent);
    const [error, setError] = useState("");

    // Syncs form values when editing a selected event
    useEffect(() => {
        setEvent(initialEvent);
    }, [initialEvent]);

    // Updates the matching event field based on input name
    const handleChange = (e) => {
        const { name, value } = e.target;

        setEvent({
            ...event,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensures all event fields are filled before submitting
        if (
            !event.title ||
            !event.categoryName ||
            !event.description ||
            !event.eventDate ||
            !event.startTime ||
            !event.endTime ||
            !event.location ||
            !event.address ||
            !event.city ||
            !event.personInCharge ||
            !event.contactPhone ||
            !event.ticketPrice ||
            !event.maxTicket
        ) {
            setError("Please fill in all event fields.");
            return;
        }

        // Ensures the event end time is later than the start time
        if (event.endTime <= event.startTime) {
            setError("End time must be later than start time.");
            return;
        }

        // Prevents invalid ticket price input
        if (Number(event.ticketPrice) < 0) {
            setError("Ticket price cannot be negative.");
            return;
        }

        // Ensures the event has at least one ticket available
        if (Number(event.maxTicket) <= 0) {
            setError("Max ticket must be more than 0.");
            return;
        }

        setError("");

        // Converts form values into the format expected by the backend
        onSubmit({
            ...event,
            startTime: event.startTime.length === 5 ? `${event.startTime}:00` : event.startTime,
            endTime: event.endTime.length === 5 ? `${event.endTime}:00` : event.endTime,
            ticketPrice: Number(event.ticketPrice),
            maxTicket: Number(event.maxTicket),
        });

        // Clears the form only after creating a new event
        if (buttonText === "Create Event") {
            setEvent(INITIAL_EVENT);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6">

            <h2 className="text-2xl font-bold text-[#111827] mb-2">
                {buttonText}
            </h2>

            <p className="text-sm text-[#6B7280] mb-6">
                Fill in the event details below.
            </p>

            {message && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#EF4444]">
                    {message}
                </div>
            )}
            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#EF4444]">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                    name="title"
                    value={event.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />

                <input
                    name="categoryName"
                    value={event.categoryName}
                    onChange={handleChange}
                    placeholder="Category Name"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />

                <input
                    name="description"
                    value={event.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />

                <input
                    name="eventDate"
                    type="date"
                    value={event.eventDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />

                <input
                    name="startTime"
                    type="time"
                    value={event.startTime}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />

                <input
                    name="endTime"
                    type="time"
                    value={event.endTime}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />

                <input
                    name="location"
                    value={event.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />

                <input
                    name="address"
                    value={event.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />

                <input
                    name="city"
                    value={event.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />

                <input
                    name="personInCharge"
                    value={event.personInCharge}
                    onChange={handleChange}
                    placeholder="Person In Charge"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />

                <input
                    name="contactPhone"
                    value={event.contactPhone}
                    onChange={handleChange}
                    placeholder="Contact Phone"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />

                <input
                    name="ticketPrice"
                    type="number"
                    value={event.ticketPrice}
                    onChange={handleChange}
                    placeholder="Ticket Price"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />

                <input
                    name="maxTicket"
                    type="number"
                    value={event.maxTicket}
                    onChange={handleChange}
                    placeholder="Max Ticket"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1]"
                />
            </div>

            <button
                type="submit"
                className="mt-6 bg-[#6366F1] text-white px-5 py-3 rounded-xl hover:opacity-90 font-medium"
            >
                {buttonText}
            </button>
        </form>
    );
}

export default EventForm;