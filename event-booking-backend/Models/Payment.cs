using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventBookingBackend.Models
{
    // Represents a payment record for a booking
    public class Payment
    {
        [Key]
        [Column("payment_id")]
        public int PaymentId { get; set; }


        [Range(1, int.MaxValue, ErrorMessage = "Booking ID is required.")]
        [Column("paymentBooking_id")]
        public int BookingId { get; set; }


        [Range(0, double.MaxValue, ErrorMessage = "Total price cannot be negative.")]
        [Column("total_price")]
        public decimal TotalPrice { get; set; }  // Calculated from booking ticket price and quantity


        [Required]
        [Column("payment_type")]
        public string PaymentType { get; set; } = null!;


        [Column("reference_bank")]
        public string ReferenceBank { get; set; } = "";


        [Column("account_number")]
        public string AccountNumber { get; set; } = "";


        [Column("account_name")]
        public string AccountName { get; set; } = "";


        [Column("status")]
        public string Status { get; set; } = "Pending"; // Status: Pending, Paid, Failed, or Refunded


        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("paid_at")]
        public DateTime? PaidAt { get; set; }

        [Column("failed_at")]
        public DateTime? FailedAt { get; set; }

        [Column("refunded_at")]
        public DateTime? RefundedAt { get; set; }
    }
}
