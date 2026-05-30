using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventBookingBackend.Models
{
    // Represents an event created by a user
    public class Events
    {
        [Key]
        [Column("event_id")]
        public int EventId { get; set; } = 0;

        
        [Range(1, int.MaxValue, ErrorMessage = "User is required.")]
        [Column("eventUser_id")]
        public int UserId { get; set; } = 0;


        [Required]
        [Column("title")]
        public string Title { get; set; } = null!;
  

        [Column("category_name")]
        public string CategoryName { get; set; } = "";


        [Column("description")]
        public string Description { get; set; } = "";

        [Column("event_date")]
        public DateTime EventDate { get; set; } = DateTime.Now;


        [Column("start_time")]
        public TimeSpan StartTime { get; set; } 

        [Column("end_time")]
        public TimeSpan EndTime { get; set; }


        [Required]
        [Column("location")]
        public string Location { get; set; } = null!;


        [Column("address")]
        public string Address { get; set; } = "";


        [Column("city")]
        public string City { get; set; } = "";


        [Required]
        [Column("contact_person")]
        public string PersonInCharge { get; set; } = "";


        [Required]
        [Column("contact_phone")]
        public string ContactPhone { get; set; } = "";


        [Range(0, int.MaxValue, ErrorMessage = "Ticket Price is required.")]
        [Column("ticket_price")]
        public decimal TicketPrice { get; set; }
        
        
        [Range(1, int.MaxValue, ErrorMessage = "Max Ticket is required.")]
        [Column("max_ticket")]
        public int MaxTicket { get; set; } = 0;


        [Column("available_ticket")]
        public int AvailableTicket { get; set; } // Updated when bookings are created or cancelled


        [Column("status")]
        public string Status { get; set; } = "Open"; // Status: Open, Closed, or Cancelled


        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        
        [Column("cancelled_at")]
        public DateTime? CancelledAt { get; set; }

    }
}
