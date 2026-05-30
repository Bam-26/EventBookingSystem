using EventBookingBackend.Models;
using EventBookingBackend.Repository;



namespace EventBookingBackend.Services
{
    // Handles booking business rules before data is sent to the repository
    public class BookingService : IBookingService
    {
        public BookingService(
            IBookingRepository bookingRepository,
            IEventsRepository eventsRepository,
            IUsersRepository usersRepository,
            IPaymentRepository paymentRepository)
        {
            _bookingRepository = bookingRepository;
            _eventsRepository = eventsRepository;
            _usersRepository = usersRepository;
            _paymentRepository = paymentRepository;
        }

        private readonly IBookingRepository _bookingRepository;

        private readonly IEventsRepository _eventsRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IPaymentRepository _paymentRepository;


        // Generates a unique booking code using the current timestamp
        private string GenerateBookingCode()
        {
            return "BK-" + DateTime.Now.ToString("yyyyMMddHHmmssfff");
        }


        // Checks whether the event has enough available tickets
        private bool IsTicketAvailable(Events eventData, int quantity)
        {
            return eventData.AvailableTicket >= quantity;
        }

        // Reduces available tickets after a booking is created
        private void ReduceAvailableTicket(Events eventData, int quantity)
        {
            eventData.AvailableTicket -= quantity;
        }


        // Restores available tickets when a booking is cancelled
        private void RestoreAvailableTicket(Events eventData, int quantity)
        {
            eventData.AvailableTicket += quantity;
        }


        //------------------------------------------------------------


        // Retrieves all bookings
        public async Task<IEnumerable<Booking>> GetAllBookingAsync()
        {
            return await _bookingRepository.GetAllBookingAsync();
        }


        // Retrieves a booking by its ID
        public async Task<Booking?> GetBookingByIdAsync(int bookingId)
        {
            return await _bookingRepository.GetBookingByIdAsync(bookingId);
        }

        // Retrieves bookings created by a specific user
        public async Task<IEnumerable<Booking>?> GetBookingByUserIdAsync(int userId)
        {
            var existUser = await _usersRepository.GetUserByIdAsync(userId);
            if (existUser == null)
            {
                return null;
            }
            return await _bookingRepository.GetBookingByUserIdAsync(userId);
        }

        // Retrieves bookings linked to a specific event
        public async Task<IEnumerable<Booking>?> GetBookingByEventIdAsync(int eventId)
        {
            var existEvent = await _eventsRepository.GetEventByIdAsync(eventId);
            if (existEvent == null)
            {
                return null;
            }
            return await _bookingRepository.GetBookingByEventIdAsync(eventId);
        }


        // Creates a booking only when the user, event, ticket quantity, and event status are valid
        public async Task<Booking?> CreateNewBookingAsync(Booking booking, int userId)
        {
            var eventData = await _eventsRepository.GetEventByIdAsync(booking.EventId);
            if (eventData == null)
            {
                return null;
            }
            if (eventData.Status != "Open")
            {
                return null;
            }

            var existUser = await _usersRepository.GetUserByIdAsync(userId);
            if (existUser == null)
            {
                return null;
            }

            if (booking.Quantity <= 0)
            {
                return null;
            }

            if (!IsTicketAvailable(eventData, booking.Quantity))
            {
                return null;
            }

            booking.BookingCode = GenerateBookingCode();
            booking.UserId = userId;
            booking.TicketPrice = eventData.TicketPrice;
            booking.Status = "Pending";
            booking.CreatedAt = DateTime.Now;
            booking.CancelledAt = null;
            ReduceAvailableTicket(eventData, booking.Quantity);
            await _eventsRepository.UpdateEventAsync(eventData.EventId, eventData);
            return await _bookingRepository.CreateNewBookingAsync(booking);

        }


        // Cancels a booking, restores tickets, and updates related payment status when needed
        public async Task<Booking?> CancelBookingAsync(int bookingId)
        {
            var existBooking = await _bookingRepository.GetBookingByIdAsync(bookingId);
            if (existBooking == null)
            {
                return null;
            }

            if (existBooking.Status == "Cancelled")
            {
                return null;
            }

            var ev = await _eventsRepository.GetEventByIdAsync(existBooking.EventId);
            if (ev == null)
            {
                return null;
            }


            existBooking.Status = "Cancelled";
            existBooking.CancelledAt = DateTime.Now;
            RestoreAvailableTicket(ev, existBooking.Quantity);

            var payment = await _paymentRepository.GetPaymentByBookingIdAsync(bookingId);
            if (payment != null)
            {
                if (payment.Status == "Paid")
                {
                    payment.Status = "Refunded";
                    payment.RefundedAt = DateTime.Now;
                    await _paymentRepository.UpdatePaymentAsync(payment.PaymentId, payment);
                }
                else if (payment.Status == "Pending")
                {
                    payment.Status = "Failed";
                    payment.FailedAt = DateTime.Now;
                    await _paymentRepository.UpdatePaymentAsync(payment.PaymentId, payment);
                }
            }

            await _eventsRepository.UpdateEventAsync(ev.EventId, ev);
            return await _bookingRepository.UpdateBookingAsync(bookingId, existBooking);
        }


        // Deletes a booking only after it has been cancelled
        public async Task<bool> DeleteBookingAsync(int bookingId)
        {
            var existBooking = await _bookingRepository.GetBookingByIdAsync(bookingId);
            if (existBooking == null)
            {
                return false;
            }

            if (existBooking.Status != "Cancelled")
            {
                return false;
            }

            return await _bookingRepository.DeleteBookingAsync(bookingId);
        }

        // Activates a booking only when its payment has been marked as paid
        public async Task<Booking?> ActivateBookingAsync(int bookingId)
        {
            var existBooking = await _bookingRepository.GetBookingByIdAsync(bookingId);
            if (existBooking == null)
            {
                return null;
            }

            var existPayment = await _paymentRepository.GetPaymentByBookingIdAsync(bookingId);
            if (existPayment == null)
            {
                return null;
            }
            if (existPayment.Status != "Paid")
            {
                return null;
            }

            existBooking.Status = "Active";
            return await _bookingRepository.UpdateBookingAsync(bookingId, existBooking);

        }






    }

}
