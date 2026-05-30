using EventBookingBackend.Models;

namespace EventBookingBackend.Repository
{
    // Defines database operations required for user records
    public interface IUsersRepository
    {
        Task<Users> CreateNewUserAsync(Users user);

        Task<Users?> UpdateUserAsync(int userId, Users user);

        Task<bool> DeleteUserAsync(int userId);

        Task<Users?> GetUserByIdAsync(int userId);
        
        Task<Users?> GetUserByUsernameOrEmailAsync(string usernameOrEmail);

    }
}




