namespace EventBookingBackend.DTOs
{
    // Response DTO used to return user data without exposing the password hash
    public class UserResponse
    {
        public int UserId { get; set; }

        public string Username { get; set; } = "";

        public string FullName { get; set; } = "";

        public string Email { get; set; } = "";

        public string PhoneNumber { get; set; } = "";

        public DateTime DateOfBirth { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}