using EventBookingBackend.Models;

namespace EventBookingBackend.Repository
{
    // Defines database operations required for payment records
    public interface IPaymentRepository
    {
        Task<IEnumerable<Payment>> GetAllPaymentsAsync();

        Task<Payment> CreateNewPaymentAsync(Payment payment);

        Task<Payment?> UpdatePaymentAsync(int paymentId, Payment payment);

        Task<bool> DeletePaymentAsync(int paymentId);

        Task<Payment?> GetPaymentsByIdAsync(int paymentId);
        
        // Each booking can only have one payment record
        Task<Payment?> GetPaymentByBookingIdAsync(int bookingId);
        
    }
}   




