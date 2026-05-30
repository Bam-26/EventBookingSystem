using System.ComponentModel.DataAnnotations;


namespace EventBookingBackend.DTOs
{
     // Request DTO used for user login with either username or email
    public class LoginRequest
    {
        [Required]
        public string UsernameOrEmail { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";
    }
}