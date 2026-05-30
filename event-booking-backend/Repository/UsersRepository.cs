
using Microsoft.EntityFrameworkCore;
using EventBookingBackend.Data;
using EventBookingBackend.Models;

namespace EventBookingBackend.Repository
{
	// Handles database operations for user records
	public class UsersRepository : IUsersRepository
	{
		private readonly AppDbContext _context;
		public UsersRepository(AppDbContext context) => _context = context;
		

		// Adds a new user record to the database
		public async Task<Users> CreateNewUserAsync(Users user)
		{
			_context.Users.Add(user);
			await _context.SaveChangesAsync();
			return user;
		}

		// Updates user profile fields in the database
		public async Task<Users?> UpdateUserAsync(int userId, Users user)
		{
			var existUser = await _context.Users.FindAsync(userId);

			if (existUser == null)
			{
				return null;
			}

			existUser.Username = user.Username;
			existUser.Password = user.Password;
			existUser.FullName = user.FullName;
			existUser.Email = user.Email;
			existUser.PhoneNumber = user.PhoneNumber;
			existUser.DateOfBirth = user.DateOfBirth;

			await _context.SaveChangesAsync();
			return existUser;
		}

		 // Removes a user record when it exists
		public async Task<bool> DeleteUserAsync(int userId)
		{
			var existUser = await _context.Users.FindAsync(userId);

			if (existUser == null)
			{
				return false;
			}

			_context.Users.Remove(existUser);
			await _context.SaveChangesAsync();
			return true;
		}

		// Finds a user by its primary key
		public async Task<Users?> GetUserByIdAsync(int userId)
		{
			return await _context.Users.FindAsync(userId);
		}
		
		 // Finds a user using either username or email for login
		public async Task<Users?> GetUserByUsernameOrEmailAsync(string usernameOrEmail)
		{
			return await _context.Users
        	.FirstOrDefaultAsync(user =>
            	user.Username == usernameOrEmail ||
            	user.Email == usernameOrEmail);
		}

	}
}
