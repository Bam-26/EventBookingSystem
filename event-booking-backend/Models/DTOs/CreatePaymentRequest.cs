using System.ComponentModel.DataAnnotations;

namespace EventBookingBackend.DTOs
{
    // Request DTO used when creating a payment for a booking
    public class CreatePaymentRequest
    {
        [Required]
        public string PaymentType { get; set; } = "";

        public string ReferenceBank { get; set; } = "";

        public string AccountNumber { get; set; } = "";

        public string AccountName { get; set; } = "";
    }
}