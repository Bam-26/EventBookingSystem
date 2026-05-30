using EventBookingBackend.Models;

namespace EventBookingBackend.Repository
{
    // Defines database operations required for booking records
    public interface IBookingRepository
    {
        Task<IEnumerable<Booking>> GetAllBookingAsync(); 
        
        Task<Booking> CreateNewBookingAsync(Booking book);
        
        Task<Booking?> UpdateBookingAsync(int bookingId, Booking book);
        
        Task<bool> DeleteBookingAsync(int bookingId);

        Task<Booking?> GetBookingByIdAsync(int bookingId);
        
        Task<IEnumerable<Booking>> GetBookingByUserIdAsync(int userId);
        
        Task<IEnumerable<Booking>> GetBookingByEventIdAsync(int eventId);

    }
}




