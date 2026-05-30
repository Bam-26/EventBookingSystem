
using EventBookingBackend.Models;

namespace EventBookingBackend.Services
{
    // Defines payment business operations used by the payment controller
    public interface IPaymentService
    {
        Task<IEnumerable<Payment>> GetAllPaymentsAsync();

        Task<Payment?> GetPaymentByIdAsync(int paymentId);

        Task<Payment?> GetPaymentByBookingIdAsync(int bookingId);

        Task<IEnumerable<Payment>> GetPaymentByUserIdAsync(int userId);

        Task<Payment?> CreateNewPaymentAsync(Payment payment);

        Task<bool> DeletePaymentAsync(int paymentId);

        Task<Payment?> MarkPaymentAsPaidAsync(int paymentId);

        Task<Payment?> MarkPaymentAsFailedAsync(int paymentId);

        Task<Payment?> RefundPaymentAsync(int paymentId);

    }
}
