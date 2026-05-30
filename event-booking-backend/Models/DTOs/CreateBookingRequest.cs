using System.ComponentModel.DataAnnotations;

namespace EventBookingBackend.DTOs
{
    // Request DTO used when creating a booking for an event
    public class CreateBookingRequest
    {
        [Range(1, int.MaxValue, ErrorMessage = "Event is required.")]
        public int EventId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
}