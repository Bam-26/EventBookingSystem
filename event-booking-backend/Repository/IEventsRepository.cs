using EventBookingBackend.Models;

namespace EventBookingBackend.Repository
{
    // Defines database operations required for event records
    public interface IEventsRepository
    {
        Task<IEnumerable<Events>> GetAllEventsAsync();

        Task<Events> CreateNewEventAsync(Events eventData);

        Task<Events?> UpdateEventAsync(int eventId, Events eventData);

        Task<bool> DeleteEventAsync(int eventId);

        Task<Events?> GetEventByIdAsync(int eventId);

        Task<IEnumerable<Events>> GetEventsByUserIdAsync(int userId);

        Task<IEnumerable<Events>> GetEventsByDateAsync(DateTime eventDate);

        Task<IEnumerable<Events>> GetEventsByCityAsync(string city);
        
        Task<IEnumerable<Events>> GetEventsByCategoryAsync(string categoryName);
        
        Task<IEnumerable<Events>> SearchEventsByTitleAsync(string keyword);

    }
}



