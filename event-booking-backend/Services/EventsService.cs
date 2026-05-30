using EventBookingBackend.Models;
using EventBookingBackend.Repository;


namespace EventBookingBackend.Services
{
    // Handles event business rules before data is sent to the repository
    public class EventService : IEventsService
    {
        public EventService(
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

        // Checks whether the event end time is later than the start time
        private bool IsTimeValid(Events eventData)
        {
            if (eventData.EndTime > eventData.StartTime)
            {
                return true;
            }

            return false;
        }

        // Checks whether the event date is valid and not in the past
        private bool IsEventDateValid(Events eventData)
        {
            if (eventData.EventDate == default)
            {
                return false;
            }

            if (eventData.EventDate.Date < DateTime.Now.Date)
            {
                return false;
            }

            return true;
        }

        // Checks whether the event has a valid maximum ticket amount
        private bool IsMaxTicketValid(Events eventData)
        {
            if (eventData.MaxTicket > 0)
            {
                return true;
            }

            return false;
        }

        // Checks whether the ticket price is not negative
        private bool IsTicketPriceValid(Events eventData)
        {
            if (eventData.TicketPrice >= 0)
            {
                return true;
            }

            return false;
        }


        // Marks an event as cancelled and stores the cancellation time
        private void SetEventCancelled(Events eventData)
        {
            eventData.Status = "Cancelled";
            eventData.CancelledAt = DateTime.Now;
        }


        // Calculates how many tickets have already been booked
        private int GetBookedTicketCount(Events eventData)
        {
            return eventData.MaxTicket - eventData.AvailableTicket;
        }


        // Prevents max ticket from being reduced below the number of booked tickets
        private bool IsNewMaxTicketValid(Events existEvent, int newMaxTicket)
        {
            var bookedTicket = GetBookedTicketCount(existEvent);
            return newMaxTicket >= bookedTicket;
        }

        // Calculates new available tickets after max ticket is updated
        private int CalculateNewAvailableTicket(Events existEvent, int newMaxTicket)
        {
            var bookedTicket = GetBookedTicketCount(existEvent);
            return newMaxTicket - bookedTicket;
        }

        // ------------------------------------------------

        // Retrieves all events
        public async Task<IEnumerable<Events>> GetAllEventsAsync()
        {
            return await _eventsRepository.GetAllEventsAsync();
        }

        // Retrieves an event by its ID
        public async Task<Events?> GetEventByIdAsync(int eventId)
        {
            return await _eventsRepository.GetEventByIdAsync(eventId);
        }

        // Retrieves events created by a specific user
        public async Task<IEnumerable<Events>> GetEventByUserIdAsync(int userId)
        {
            return await _eventsRepository.GetEventsByUserIdAsync(userId);
        }


        // Retrieves events that match a specific date
        public async Task<IEnumerable<Events>> GetEventsByDateAsync(DateTime eventDate)
        {
            return await _eventsRepository.GetEventsByDateAsync(eventDate);
        }

        // Retrieves events that match a city search value
        public async Task<IEnumerable<Events>> GetEventsByCityAsync(string city)
        {
            return await _eventsRepository.GetEventsByCityAsync(city);
        }

        // Retrieves events that match a category search value
        public async Task<IEnumerable<Events>> GetEventsByCategoryAsync(string categoryName)
        {
            return await _eventsRepository.GetEventsByCategoryAsync(categoryName);
        }

        // Retrieves events that match a title keyword
        public async Task<IEnumerable<Events>> SearchEventsByTitleAsync(string keyword)
        {
            return await _eventsRepository.SearchEventsByTitleAsync(keyword);
        }

        // Creates an event only when the owner and event input are valid
        public async Task<Events?> CreateNewEventAsync(Events eventData, int userId)
        {
            var existUser = await _usersRepository.GetUserByIdAsync(userId);
            if (existUser == null)
            {
                return null;
            }

            if (!IsEventDateValid(eventData))
            {
                return null;
            }

            if (!IsTimeValid(eventData))
            {
                return null;
            }

            if (!IsMaxTicketValid(eventData))
            {
                return null;
            }

            if (!IsTicketPriceValid(eventData))
            {
                return null;
            }

            eventData.UserId = userId;
            eventData.AvailableTicket = eventData.MaxTicket;
            eventData.Status = "Open";
            eventData.CreatedAt = DateTime.Now;
            eventData.CancelledAt = null;

            return await _eventsRepository.CreateNewEventAsync(eventData);

        }


        // Updates an event while keeping ownership, status, and ticket history consistent
        public async Task<Events?> UpdateEventAsync(int eventId, Events eventData)
        {
            // ev data baru yg dikirim dr frontend
            var existEvent = await _eventsRepository.GetEventByIdAsync(eventId);
            if (existEvent == null)
            {
                return null;
            }

            if (existEvent.Status == "Cancelled" || existEvent.Status == "Closed")
            {
                return null;
            }

            if (!IsEventDateValid(eventData))
            {
                return null;
            }

            if (!IsTimeValid(eventData))
            {
                return null;
            }

            if (!IsMaxTicketValid(eventData))
            {
                return null;
            }

            if (!IsTicketPriceValid(eventData))
            {
                return null;
            }

            eventData.EventId = existEvent.EventId;
            eventData.UserId = existEvent.UserId;
            if (!IsNewMaxTicketValid(existEvent, eventData.MaxTicket))
            {
                return null;
            }
            eventData.AvailableTicket = CalculateNewAvailableTicket(existEvent, eventData.MaxTicket);
            eventData.CreatedAt = existEvent.CreatedAt;
            eventData.CancelledAt = existEvent.CancelledAt;
            eventData.Status = existEvent.Status;

            return await _eventsRepository.UpdateEventAsync(eventId, eventData);
        }


        // Deletes a cancelled event together with its related bookings and payments
        public async Task<bool> DeleteEventAsync(int eventId)
        {
            var existEvent = await _eventsRepository.GetEventByIdAsync(eventId);
            if (existEvent == null)
            {
                return false;
            }

            if (existEvent.Status != "Cancelled")
            {
                return false;
            }

            var bookings = await _bookingRepository.GetBookingByEventIdAsync(eventId);

            foreach (var booking in bookings)
            {
                var payment = await _paymentRepository.GetPaymentByBookingIdAsync(booking.BookingId);
                if (payment != null)
                {
                    var paymentDeleted = await _paymentRepository.DeletePaymentAsync(payment.PaymentId);
                    if (!paymentDeleted)
                    {
                        return false;
                    }
                }

                var bookingDeleted = await _bookingRepository.DeleteBookingAsync(booking.BookingId);
                if (!bookingDeleted)
                {
                    return false;
                }
            }

            return await _eventsRepository.DeleteEventAsync(eventId);
        }


        // Cancels an open event and updates all related bookings and payments
        public async Task<Events?> CancelEventAsync(int eventId)
        {
            var existEvent = await _eventsRepository.GetEventByIdAsync(eventId);
            if (existEvent == null)
            {
                return null;
            }

            if (existEvent.Status == "Cancelled")
            {
                return null; 
            }

            if (existEvent.Status == "Closed")
            {
                return null;
            }

            SetEventCancelled(existEvent);

            var existBooking = await _bookingRepository.GetBookingByEventIdAsync(eventId);
            foreach (var booking in existBooking)
            {
                if (booking.Status != "Cancelled")
                {
                    booking.Status = "Cancelled";
                    booking.CancelledAt = DateTime.Now;
                    await _bookingRepository.UpdateBookingAsync(booking.BookingId, booking);

                    var payment = await _paymentRepository.GetPaymentByBookingIdAsync(booking.BookingId);
                    if (payment != null)
                    {
                        if (payment.Status == "Paid")
                        {
                            payment.Status = "Refunded";
                            payment.RefundedAt = DateTime.Now;
                        }
                        else if (payment.Status == "Pending")
                        {
                            payment.Status = "Failed";
                            payment.FailedAt = DateTime.Now;
                        }
                        await _paymentRepository.UpdatePaymentAsync(payment.PaymentId, payment);
                    }
                }
            }

            return await _eventsRepository.UpdateEventAsync(eventId, existEvent);
        }

        // Closes an open event so it can no longer receive new bookings
        public async Task<Events?> CloseEventAsync(int eventId)
        {
            var existEvent = await _eventsRepository.GetEventByIdAsync(eventId);
            if (existEvent == null)
            {
                return null;
            }

            if (existEvent.Status == "Cancelled")
            {
                return null;
            }

            if (existEvent.Status == "Closed")
            {
                return null; 
            }

            existEvent.Status = "Closed";
            return await _eventsRepository.UpdateEventAsync(eventId, existEvent);
        }

    }

}
