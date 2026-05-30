
using Microsoft.EntityFrameworkCore;
using EventBookingBackend.Data;
using EventBookingBackend.Models;


namespace EventBookingBackend.Repository
{
    // Handles database operations for event records
    public class EventsRepository : IEventsRepository
    {
         // Provides access to the database
        private readonly AppDbContext _context;
        public EventsRepository(AppDbContext context) => _context = context;

        // Retrieves all event records from the database
        public async Task<IEnumerable<Events>> GetAllEventsAsync() =>
            await _context.Events.ToListAsync();

        // Adds a new event record to the database
        public async Task<Events> CreateNewEventAsync(Events eventData)
        {
            _context.Events.Add(eventData);
            await _context.SaveChangesAsync();
            return eventData; 
        }

        // Updates editable event fields in the database
        public async Task<Events?> UpdateEventAsync(int eventId, Events eventData)
        {
            var existEvent = await _context.Events.FindAsync(eventId);
            
            if (existEvent == null)
            {
                return null;
            }

            existEvent.Title = eventData.Title;
            existEvent.CategoryName = eventData.CategoryName;
            existEvent.Description = eventData.Description;
            existEvent.EventDate = eventData.EventDate;
            existEvent.StartTime = eventData.StartTime;
            existEvent.EndTime = eventData.EndTime;
            existEvent.Location = eventData.Location;
            existEvent.Address = eventData.Address;
            existEvent.City = eventData.City;
            existEvent.PersonInCharge = eventData.PersonInCharge;
            existEvent.ContactPhone = eventData.ContactPhone;
            existEvent.TicketPrice = eventData.TicketPrice;
            existEvent.MaxTicket = eventData.MaxTicket;
            existEvent.Status = eventData.Status;
			existEvent.CancelledAt = eventData.CancelledAt;
            existEvent.AvailableTicket = eventData.AvailableTicket;
            
            await _context.SaveChangesAsync();
            return existEvent; 
        }

        // Removes an event record when it exists
        public async Task<bool> DeleteEventAsync(int eventId)
        {
            var existEvent = await _context.Events.FindAsync(eventId);
            
            if (existEvent == null)
            {
                return false;
            }

            _context.Events.Remove(existEvent);
            await _context.SaveChangesAsync();
            return true; 
        }

        // Finds an event by its primary key
        public async Task<Events?> GetEventByIdAsync(int eventId)
        {
            return await _context.Events.FindAsync(eventId);
        }

        // Retrieves all events created by a specific user
        public async Task<IEnumerable<Events>> GetEventsByUserIdAsync(int userId)
        {
            return await _context.Events
            .Where(eventData => eventData.UserId == userId)
            .ToListAsync();
        }

        // Retrieves events that match a specific event date
        public async Task<IEnumerable<Events>> GetEventsByDateAsync(DateTime eventDate)
        {
            return await _context.Events
            .Where(eventData => eventData.EventDate.Date == eventDate.Date) // pake date, biar cari date aja
            .ToListAsync();
        }

        // Retrieves events whose city contains the search value        
        public async Task<IEnumerable<Events>> GetEventsByCityAsync(string city)
        {
            return await _context.Events
            .Where(eventData => eventData.City.ToLower().Contains(city.ToLower()))
            .ToListAsync();
        }

         // Retrieves events whose category contains the search value
        public async Task<IEnumerable<Events>> GetEventsByCategoryAsync(string categoryName)
        {
            return await _context.Events 
            .Where(eventData => eventData.CategoryName.ToLower().Contains(categoryName.ToLower())) // pake gini biar flexible
            .ToListAsync();
        }

        // Retrieves events whose title contains the search keyword
        public async Task<IEnumerable<Events>> SearchEventsByTitleAsync(string keyword)
        {
            return await _context.Events
            .Where(eventData => eventData.Title.ToLower().Contains(keyword.ToLower()))
            .ToListAsync();
        }

    }
}
