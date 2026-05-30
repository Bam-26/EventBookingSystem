using EventBookingBackend.Models;
using EventBookingBackend.Repository;


namespace EventBookingBackend.Services
{
    // Handles payment business rules before data is sent to the repository
    public class PaymentService : IPaymentService
    {
        public PaymentService(
        IPaymentRepository paymentRepository,
        IBookingRepository bookingRepository,
        IEventsRepository eventsRepository)
        {
            _paymentRepository = paymentRepository;
            _bookingRepository = bookingRepository;
            _eventsRepository = eventsRepository;
        }

        private readonly IPaymentRepository _paymentRepository;
        private readonly IBookingRepository _bookingRepository;
        private readonly IEventsRepository _eventsRepository;


        // Calculates total payment amount from booking ticket price and quantity
        private decimal CalculateTotalPrice(Booking booking)
        {
            return booking.TicketPrice * booking.Quantity;
        }

        // Checks whether the selected payment type is supported
        private bool IsPaymentTypeValid(Payment payment)
        {
            if (payment.PaymentType == "Bank Transfer" ||
                payment.PaymentType == "Credit Card" ||
                payment.PaymentType == "E-Wallet" ||
                payment.PaymentType == "Cash")
            {
                return true;
            }

            return false;
        }

        // Checks whether the payment status is within the allowed values
        private bool IsPaymentStatusValid(Payment payment)
        {
            if (payment.Status == "Pending" ||
                payment.Status == "Paid" ||
                payment.Status == "Failed" ||
                payment.Status == "Refunded")
            {
                return true;
            }

            return false;
        }

        // Sets default payment values when a new payment is created
        private void SetPaymentDefaultValue(Payment payment, Booking booking)
        {
            payment.TotalPrice = CalculateTotalPrice(booking);
            payment.Status = "Pending";
            payment.CreatedAt = DateTime.Now;
            payment.PaidAt = null;
            payment.FailedAt = null;
            payment.RefundedAt = null;
        }

        // ------------------------------------------------

        // Retrieves all payments
        public async Task<IEnumerable<Payment>> GetAllPaymentsAsync()
        {
            return await _paymentRepository.GetAllPaymentsAsync();
        }


        // Retrieves all payments by its ID
        public async Task<Payment?> GetPaymentByIdAsync(int paymentId)
        {
            return await _paymentRepository.GetPaymentsByIdAsync(paymentId);
        }

        // Retrieves a payment linked to a specific booking
        public async Task<Payment?> GetPaymentByBookingIdAsync(int bookingId)
        {
            return await _paymentRepository.GetPaymentByBookingIdAsync(bookingId);
        }

        // Retrieves payments that belong to bookings created by a specific user
        public async Task<IEnumerable<Payment>> GetPaymentByUserIdAsync(int userId)
        {
            var bookings = await _bookingRepository.GetBookingByUserIdAsync(userId);
            var bookingIds = bookings.Select(b => b.BookingId).ToHashSet();

            var allPayments = await _paymentRepository.GetAllPaymentsAsync();
            return allPayments.Where(p => bookingIds.Contains(p.BookingId));
        }

        // Creates a payment only when the booking is pending and does not already have a payment
        public async Task<Payment?> CreateNewPaymentAsync(Payment payment)
        {
            var existBooking = await _bookingRepository.GetBookingByIdAsync(payment.BookingId);
            if (existBooking == null)
            {
                return null;
            }

            if (existBooking.Status == "Cancelled")
            {
                return null;
            }

            if (existBooking.Status != "Pending")
            {
                return null;
            }

            var existPayment = await _paymentRepository.GetPaymentByBookingIdAsync(payment.BookingId);
            if (existPayment != null)
            {
                return null;
            }

            if (!IsPaymentTypeValid(payment))
            {
                return null;
            }

            SetPaymentDefaultValue(payment, existBooking);
            if (!IsPaymentStatusValid(payment))
            {
                return null;
            }

            return await _paymentRepository.CreateNewPaymentAsync(payment);
        }

        // Deletes a payment only when it is not already paid
        public async Task<bool> DeletePaymentAsync(int paymentId)
        {
            var existPayment = await _paymentRepository.GetPaymentsByIdAsync(paymentId);
            if (existPayment == null)
            {
                return false;
            }

            if (existPayment.Status == "Paid")
            {
                return false;
            }

            return await _paymentRepository.DeletePaymentAsync(paymentId);
        }

        // Marks a pending payment as paid and activates the related booking
        public async Task<Payment?> MarkPaymentAsPaidAsync(int paymentId)
        {
            var existPayment = await _paymentRepository.GetPaymentsByIdAsync(paymentId);
            if (existPayment == null)
            {
                return null;
            }
            if (existPayment.Status != "Pending")
            {
                return null;
            }

            var existBooking = await _bookingRepository.GetBookingByIdAsync(existPayment.BookingId);
            if (existBooking == null)
            {
                return null;
            }

            if (existBooking.Status != "Pending")
            {
                return null;
            }

            existPayment.Status = "Paid";
            existPayment.PaidAt = DateTime.Now;
            existPayment.FailedAt = null;
            existPayment.RefundedAt = null;

            existBooking.Status = "Active";
            existBooking.CancelledAt = null;
            await _bookingRepository.UpdateBookingAsync(existBooking.BookingId, existBooking);
            return await _paymentRepository.UpdatePaymentAsync(paymentId, existPayment);
        }


        // Marks a pending payment as failed, cancels the booking, and restores event tickets
        public async Task<Payment?> MarkPaymentAsFailedAsync(int paymentId)
        {
            var existPayment = await _paymentRepository.GetPaymentsByIdAsync(paymentId);
            if (existPayment == null)
            {
                return null;
            }

            if (existPayment.Status != "Pending")
            {
                return null;
            }

            var existBooking = await _bookingRepository.GetBookingByIdAsync(existPayment.BookingId);
            if (existBooking == null)
            {
                return null;
            }

            var eventData = await _eventsRepository.GetEventByIdAsync(existBooking.EventId);
            if (eventData == null)
            {
                return null;
            }

            existPayment.Status = "Failed";
            existPayment.FailedAt = DateTime.Now;
            existPayment.PaidAt = null;
            existPayment.RefundedAt = null;

            if (existBooking.Status != "Cancelled")
            {
                existBooking.Status = "Cancelled";
                existBooking.CancelledAt = DateTime.Now;

                eventData.AvailableTicket += existBooking.Quantity;

                await _eventsRepository.UpdateEventAsync(eventData.EventId, eventData);
                await _bookingRepository.UpdateBookingAsync(existBooking.BookingId, existBooking);
            }

            return await _paymentRepository.UpdatePaymentAsync(paymentId, existPayment);
        }

        // Refunds a paid payment, cancels the booking, and restores event tickets
        public async Task<Payment?> RefundPaymentAsync(int paymentId)
        {
            var existPayment = await _paymentRepository.GetPaymentsByIdAsync(paymentId);
            if (existPayment == null)
            {
                return null;
            }

            if (existPayment.Status != "Paid")
            {
                return null;
            }

            var existBooking = await _bookingRepository.GetBookingByIdAsync(existPayment.BookingId);
            if (existBooking == null)
            {
                return null;
            }

            var existEvent = await _eventsRepository.GetEventByIdAsync(existBooking.EventId);
            if (existEvent == null)
            {
                return null;
            }

            existPayment.Status = "Refunded";
            existPayment.RefundedAt = DateTime.Now;

            if (existBooking.Status != "Cancelled")
            {
                existBooking.Status = "Cancelled";
                existBooking.CancelledAt = DateTime.Now;

                existEvent.AvailableTicket += existBooking.Quantity;

                await _eventsRepository.UpdateEventAsync(existEvent.EventId, existEvent);
                await _bookingRepository.UpdateBookingAsync(existBooking.BookingId, existBooking);
            }

            return await _paymentRepository.UpdatePaymentAsync(paymentId, existPayment);
        }
    }
}