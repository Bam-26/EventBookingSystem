
using EventBookingBackend.Models;

namespace EventBookingBackend.Services
{
    // Defines event business operations used by the event controller
    public interface IEventsService
    {
        Task<IEnumerable<Events>> GetAllEventsAsync();

        Task<Events?> GetEventByIdAsync(int eventId);

        Task<IEnumerable<Events>> GetEventByUserIdAsync(int userId);

        Task<IEnumerable<Events>> GetEventsByDateAsync(DateTime eventDate);

        Task<IEnumerable<Events>> GetEventsByCityAsync(string city);
        
        Task<IEnumerable<Events>> GetEventsByCategoryAsync(string categoryName);
        
        Task<IEnumerable<Events>> SearchEventsByTitleAsync(string keyword);

        Task<Events?> CreateNewEventAsync(Events ev, int userId);

        Task<Events?> UpdateEventAsync(int eventId, Events ev);
        
        Task<bool> DeleteEventAsync(int eventId);

        Task<Events?> CancelEventAsync(int eventId);

        Task<Events?> CloseEventAsync(int eventId);
    }
}
