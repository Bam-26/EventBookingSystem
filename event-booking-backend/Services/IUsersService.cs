using EventBookingBackend.Models;
using EventBookingBackend.DTOs;

namespace EventBookingBackend.Services
{
    // Defines user business operations used by the user controller
    public interface IUsersService
    {

        Task<Users?> GetUserByIdAsync(int userId);


        Task<Users?> CreateNewUserAsync(Users user);

        Task<Users?> UpdateUserAsync(int userId, UpdateUserRequest request);
        
        Task<bool> DeleteUserAsync(int userId);

        Task<Users?> LoginAsync(string usernameOrEmail, string password);
    }
}