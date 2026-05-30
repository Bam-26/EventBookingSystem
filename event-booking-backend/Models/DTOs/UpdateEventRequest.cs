using System.ComponentModel.DataAnnotations;

namespace EventBookingBackend.DTOs
{
    // Request DTO used when updating editable event details
    public class UpdateEventRequest
    {
        [Required]
        public string Title { get; set; } = "";

        [Required]
        public string CategoryName { get; set; } = "";

        [Required]
        public string Description { get; set; } = "";

        [Required]
        public DateTime EventDate { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [Required]
        public string Location { get; set; } = "";

        [Required]
        public string Address { get; set; } = "";

        [Required]
        public string City { get; set; } = "";

        [Required]
        public string PersonInCharge { get; set; } = "";

        [Required]
        public string ContactPhone { get; set; } = "";

        [Range(0, double.MaxValue, ErrorMessage = "Ticket price cannot be negative.")]
        public decimal TicketPrice { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Max ticket is required.")]
        public int MaxTicket { get; set; }
    }
}