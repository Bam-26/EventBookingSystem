
using Microsoft.EntityFrameworkCore;
using EventBookingBackend.Data;
using EventBookingBackend.Models;


namespace EventBookingBackend.Repository
{
	// Handles database operations for payment records
	public class PaymentRepository : IPaymentRepository
	{
		// Provides access to the database
		private readonly AppDbContext _context;
		public PaymentRepository(AppDbContext context) => _context = context;


		// Retrieves all payment records from the database
		public async Task<IEnumerable<Payment>> GetAllPaymentsAsync() =>
			await _context.Payment.ToListAsync();


		// Adds a new payment record to the database
		public async Task<Payment> CreateNewPaymentAsync(Payment payment)
		{
			_context.Payment.Add(payment);
			await _context.SaveChangesAsync();
			return payment;
		}

		// Updates payment fields that can change during payment status transitions
		public async Task<Payment?> UpdatePaymentAsync(int paymentId, Payment payment)
		{
			var existPayment = await _context.Payment.FindAsync(paymentId);

			if (existPayment == null)
			{
				return null;
			}

			existPayment.TotalPrice = payment.TotalPrice;
			existPayment.PaymentType = payment.PaymentType;
			existPayment.ReferenceBank = payment.ReferenceBank;
			existPayment.AccountNumber = payment.AccountNumber;
			existPayment.AccountName = payment.AccountName;
			existPayment.Status = payment.Status;
			existPayment.PaidAt = payment.PaidAt;
			existPayment.FailedAt = payment.FailedAt;
			existPayment.RefundedAt = payment.RefundedAt;

			await _context.SaveChangesAsync();
			return existPayment;
		}

		// Removes a payment record when it exists
		public async Task<bool> DeletePaymentAsync(int paymentId)
		{
			var existPayment = await _context.Payment.FindAsync(paymentId);

			if (existPayment == null)
			{
				return false;
			}

			_context.Payment.Remove(existPayment);
			await _context.SaveChangesAsync();
			return true;
		}

		// Finds a payment by its primary key
		public async Task<Payment?> GetPaymentsByIdAsync(int paymentId)
		{
			return await _context.Payment.FindAsync(paymentId);
		}

		// Finds the payment linked to a specific booking
		public async Task<Payment?> GetPaymentByBookingIdAsync(int bookingId)
		{
			return await _context.Payment
				.FirstOrDefaultAsync(payment => payment.BookingId == bookingId);
		}

	}
}
