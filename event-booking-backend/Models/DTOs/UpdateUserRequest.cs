using System.ComponentModel.DataAnnotations;

namespace EventBookingBackend.DTOs
{
    // Request DTO used for updating user profile information
    public class UpdateUserRequest
    {
        public string? Username { get; set; }

        public string? Password { get; set; }  // Optional (Empty value keeps the current password)

        public string? FullName { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }
    }
}