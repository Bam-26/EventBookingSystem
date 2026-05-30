import EventItem from "./EventItem";

function EventList({ events = [], activeSection, onEdit, onDelete, onCancel, onClose }) {
    // Displays a fallback message when there are no events to show
    if (events.length === 0) {
        return (
            <div className="space-y-3">
                <p>No events found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Renders each event using the reusable EventItem component */}
            {events.map((event) => (
                <EventItem
                    key={event.eventId}
                    event={event}
                    activeSection={activeSection}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onCancel={onCancel}
                    onClose={onClose}
                />
            ))}
        </div>
    );
}

export default EventList;