using System.ComponentModel.DataAnnotations;
using EventBookingBackend.Models;
using Microsoft.EntityFrameworkCore;


namespace EventBookingBackend.Data
{
    public class AppDbContext : DbContext
    {
        // Represents the application's database context and maps model classes to database tables
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Database tables used by the event booking system
        public DbSet<Users> Users { get; set; }
        public DbSet<Events> Events { get; set; }
        public DbSet<Booking> Booking { get; set; }
        public DbSet<Payment> Payment { get; set; }
    }
}


