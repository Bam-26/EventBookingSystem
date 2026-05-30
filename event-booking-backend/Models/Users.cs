using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventBookingBackend.Models
{
    // Represents a registered user account in the system
    public class Users
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }


        [Required] 
        [Column("username")]
        public string Username { get; set; } = null!;


        [Required]
        [Column("password")]
        public string Password { get; set; } = null!; // Stores the BCrypt hashed password


        [Required]
        [Column("name")]
        public string FullName { get; set; } = null!;


        [Required]
        [EmailAddress] // biar cek format email
        [Column("email")]
        public string Email { get; set; } = null!;


        [Required]
        [Column("phone")]
        public string PhoneNumber { get; set; } = null!;


        [Column("dob")]
        public DateTime DateOfBirth { get; set; }


        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
