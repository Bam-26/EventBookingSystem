using EventBookingBackend.Models;

namespace EventBookingBackend.Services
{
    // Defines booking business operations used by the booking controller
    public interface IBookingService
    {
        Task<IEnumerable<Booking>> GetAllBookingAsync();

        Task<Booking?> GetBookingByIdAsync(int bookingId);

        Task<IEnumerable<Booking>?> GetBookingByUserIdAsync(int userId);

        Task<IEnumerable<Booking>?> GetBookingByEventIdAsync(int eventId);

        Task<Booking?> CreateNewBookingAsync(Booking booking, int userId);

        Task<Booking?> CancelBookingAsync(int bookingId);

        Task<bool> DeleteBookingAsync(int bookingId);

        Task<Booking?> ActivateBookingAsync(int bookingId);
    }
}