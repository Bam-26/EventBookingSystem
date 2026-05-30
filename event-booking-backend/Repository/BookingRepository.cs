
using Microsoft.EntityFrameworkCore;
using EventBookingBackend.Data;
using EventBookingBackend.Models;

namespace EventBookingBackend.Repository
{
	// Handles database operations for booking records
	public class BookingRepository : IBookingRepository
	{
		// Provides access to the database 
		private readonly AppDbContext _context;

		public BookingRepository(AppDbContext context) => _context = context;

		// Retrieves all booking records from the database
		public async Task<IEnumerable<Booking>> GetAllBookingAsync() =>
			await _context.Booking.ToListAsync();
		// tolistasync untuk ambil banyak data, misal ambil semua row dari table booking

		// Adds a new booking record to the database
		public async Task<Booking> CreateNewBookingAsync(Booking booking)
		{
			_context.Booking.Add(booking);
			await _context.SaveChangesAsync();
			return booking; // return booking so that service layer know what this booking contains 
		}

		// Updates booking fields that can change after creation
		public async Task<Booking?> UpdateBookingAsync(int bookingId, Booking booking)
		{
			var existBooking = await _context.Booking.FindAsync(bookingId);
			if (existBooking == null)
			{
				return null;
			}

			existBooking.Quantity = booking.Quantity;
			existBooking.TicketPrice = booking.TicketPrice;
			existBooking.Status = booking.Status;
			existBooking.CancelledAt = booking.CancelledAt;

			await _context.SaveChangesAsync();
			return existBooking;
		}

		// Removes a booking record when it exists
		public async Task<bool> DeleteBookingAsync(int bookingId)
		{
			var existBooking = await _context.Booking.FindAsync(bookingId);
			// cek data masih ada ga kalo mau dihapus untuk safety
			if (existBooking == null)
			{
				return false;
			}

			_context.Booking.Remove(existBooking);
			await _context.SaveChangesAsync();
			return true;
		}

		// Finds a booking by its primary key
		public async Task<Booking?> GetBookingByIdAsync(int bookingId)
		{
			return await _context.Booking.FindAsync(bookingId);
		}

		// Retrieves all bookings created by a specific user
		public async Task<IEnumerable<Booking>> GetBookingByUserIdAsync(int userId)
		{
			return await _context.Booking
			.Where(book => book.UserId == userId)
			.ToListAsync();
		}

		 // Retrieves all bookings linked to a specific event
		public async Task<IEnumerable<Booking>> GetBookingByEventIdAsync(int eventId)
		{
			return await _context.Booking
			.Where(book => book.EventId == eventId) 
			.ToListAsync();
		}

	}
}
