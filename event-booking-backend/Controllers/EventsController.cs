using Microsoft.AspNetCore.Mvc;
using EventBookingBackend.Models;
using EventBookingBackend.Services;
using EventBookingBackend.DTOs;

namespace EventBookingBackend.Controllers
{
    // Handles event API requests and delegates event business rules to the event service
    [Route("api/events")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventsService _eventsService;

        public EventsController(IEventsService eventsService)
        {
            _eventsService = eventsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _eventsService.GetAllEventsAsync();
            return Ok(new
            {
                message = "Events retrieved successfully.",
                data = events
            });
        }

        [HttpGet("{eventId}")]
        public async Task<IActionResult> GetEventById(int eventId)
        {
            var eventData  = await _eventsService.GetEventByIdAsync(eventId);
            if (eventData  == null)
            {
                return NotFound(new
                {
                    message = "Event ID not found."
                });
            }

            return Ok(new
            {
                message = "Event retrieved successfully.",
                data = eventData 
            });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetEventByUserId(int userId)
        {
            var events = await _eventsService.GetEventByUserIdAsync(userId);
            return Ok(new
            {
                message = "Events retrieved successfully.",
                data = events
            });
        }

        [HttpGet("date/{eventDate}")]
        public async Task<IActionResult> GetEventsByDate(DateTime eventDate)
        {
            var events = await _eventsService.GetEventsByDateAsync(eventDate);
            return Ok(new
            {
                message = "Events retrieved successfully.",
                data = events
            });
        }

        [HttpGet("city/{city}")]
        public async Task<IActionResult> GetEventsByCity(string city)
        {
            var events = await _eventsService.GetEventsByCityAsync(city);
            return Ok(new
            {
                message = "Events retrieved successfully.",
                data = events
            });
        }

        [HttpGet("category/{categoryName}")]
        public async Task<IActionResult> GetEventsByCategory(string categoryName)
        {
            var events = await _eventsService.GetEventsByCategoryAsync(categoryName);
            return Ok(new
            {
                message = "Events retrieved successfully.",
                data = events
            });
        }

        [HttpGet("search/{keyword}")]
        public async Task<IActionResult> SearchEventsByTitle(string keyword)
        {
            var events = await _eventsService.SearchEventsByTitleAsync(keyword);
            return Ok(new
            {
                message = "Events retrieved successfully.",
                data = events
            });
        }

        [HttpPost("create/{userId}")]
        public async Task<IActionResult> CreateNewEvent([FromBody] CreateEventRequest request, int userId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed.",
                    errors = ModelState
                });
            }

            // Only editable event fields are mapped here. Ownership, status, and ticket availability are handled in the service.=
            // Maps the request DTO to the event model. Business validation is handled by the service
            var eventData = new Events
            {
                Title = request.Title,
                CategoryName = request.CategoryName,
                Description = request.Description,
                EventDate = request.EventDate,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Location = request.Location,
                Address = request.Address,
                City = request.City,
                PersonInCharge = request.PersonInCharge,
                ContactPhone = request.ContactPhone,
                TicketPrice = request.TicketPrice,
                MaxTicket = request.MaxTicket
            };

            var newEvent = await _eventsService.CreateNewEventAsync(eventData, userId);

            if (newEvent == null)
            {
                return BadRequest(new
                {
                    message = "Create event failed. User may not exist, time may be invalid, or ticket data is invalid."
                });
            }

            return CreatedAtAction(
                nameof(GetEventById),
                new { eventId = newEvent.EventId },
                new
                {
                    message = "Event created successfully.",
                    data = newEvent 
                });
        }

        [HttpPut("update/{eventId}")]
        public async Task<IActionResult> UpdateEvent(int eventId, [FromBody] UpdateEventRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed.",
                    errors = ModelState
                });
            }

            var eventData = new Events
            {
                Title = request.Title,
                CategoryName = request.CategoryName,
                Description = request.Description,
                EventDate = request.EventDate,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Location = request.Location,
                Address = request.Address,
                City = request.City,
                PersonInCharge = request.PersonInCharge,
                ContactPhone = request.ContactPhone,
                TicketPrice = request.TicketPrice,
                MaxTicket = request.MaxTicket
            };

            var updatedEvent = await _eventsService.UpdateEventAsync(eventId, eventData);
            if (updatedEvent == null)
            {
                return BadRequest(new
                {
                    message = "Update event failed. Event may not exist, event may be cancelled, event may be closed, or input is invalid."
                });
            }

            return Ok(new
            {
                message = "Event updated successfully.",
                data = updatedEvent 
            });
        }

        [HttpPut("cancel/{eventId}")]
        public async Task<IActionResult> CancelEvent(int eventId)
        {
            // Cancelling an event also updates its related bookings and payments in the service
            var eventData = await _eventsService.CancelEventAsync(eventId);
            if (eventData == null)
            {
                return BadRequest(new
                {
                    message = "Cancel event failed. Event may not exist, already cancelled, or already closed."
                });
            }

            return Ok(new
            {
                message = "Event cancelled successfully.",
                data = eventData 
            });
        }

        [HttpPut("close/{eventId}")]
        public async Task<IActionResult> CloseEvent(int eventId)
        {
            // Closing an event prevents future bookings without deleting event history
            var eventData = await _eventsService.CloseEventAsync(eventId);
            if (eventData == null)
            {
                return BadRequest(new
                {
                    message = "Close event failed. Event may not exist or event is cancelled."
                });
            }

            return Ok(new
            {
                message = "Event closed successfully.",
                data = eventData 
            });
        }

        [HttpDelete("delete/{eventId}")]
        public async Task<IActionResult> DeleteEvent(int eventId)
        {
            // Deleting an event is only allowed after cancellation. Related bookings and payments are removed by the service
            var eventData = await _eventsService.DeleteEventAsync(eventId);
            if (eventData == false)
            {
                return BadRequest(new
                {
                    message = "Delete event failed. Event must exist and must be cancelled before delete."
                });
            }

            return Ok(new
            {
                message = "Event deleted successfully."
            });
        }
    }
}