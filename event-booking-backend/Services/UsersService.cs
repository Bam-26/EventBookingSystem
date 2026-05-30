using EventBookingBackend.Models;
using EventBookingBackend.Repository;
using EventBookingBackend.DTOs;
using System.Text.RegularExpressions;



namespace EventBookingBackend.Services
{
    // Handles user business rules before data is sent to the repository
    public class UsersService : IUsersService
    {
        public UsersService(
            IUsersRepository usersRepository,
            IEventsRepository eventsRepository,
            IBookingRepository bookingRepository)
        {
            _usersRepository = usersRepository;
            _eventsRepository = eventsRepository;
            _bookingRepository = bookingRepository;
        }

        private readonly IUsersRepository _usersRepository;
        private readonly IEventsRepository _eventsRepository;
        private readonly IBookingRepository _bookingRepository;

        // Checks whether the email is filled and contains a basic email format
        private bool IsEmailValid(Users user)
        {
            if (string.IsNullOrWhiteSpace(user.Email))
            {
                return false;
            }

            return user.Email.Contains("@");
        }

        // Checks whether the password follows the required length and character rules
        private bool IsPasswordValid(Users user)
        {
            if (string.IsNullOrWhiteSpace(user.Password))
            {
                return false;
            }

            if (user.Password.Length < 6 || user.Password.Length > 30)
            {
                return false;
            }

            if (!user.Password.Any(char.IsLetter))
            {
                return false;
            }

            if (!user.Password.Any(char.IsDigit))
            {
                return false;
            }

            return true;
        }

        // Checks whether the username follows the required length and character rules
        private bool IsUsernameValid(Users user)
        {
            if (string.IsNullOrWhiteSpace(user.Username))
            {
                return false;
            }

            if (user.Username.Length < 3 || user.Username.Length > 20)
            {
                return false;
            }

            if (!Regex.IsMatch(user.Username, @"^[A-Za-z0-9_]+$"))
            {
                return false;
            }

            return true;
        }

        // Checks whether the full name is filled
        private bool IsFullNameValid(Users user)
        {
            if (string.IsNullOrWhiteSpace(user.FullName))
            {
                return false;
            }

            return true;
        }


        // Checks whether the phone number is filled
        private bool IsPhoneNumberValid(Users user)
        {
            if (string.IsNullOrWhiteSpace(user.PhoneNumber))
            {
                return false;
            }

            return true;
        }

        // Checks whether the user is at least 18 years old
        private bool IsDateOfBirthValid(Users user)
        {
            if (user.DateOfBirth == default)
            {
                return false;
            }

            if (user.DateOfBirth.Date >= DateTime.Now.Date)
            {
                return false;
            }

            var age = DateTime.Now.Year - user.DateOfBirth.Year;

            if (user.DateOfBirth.Date > DateTime.Now.AddYears(-age).Date)
            {
                age--;
            }

            if (age < 18)
            {
                return false;
            }

            return true;
        }


        // ------------------------------------------------


        // Retrieves a user by its ID
        public async Task<Users?> GetUserByIdAsync(int userId)
        {
            return await _usersRepository.GetUserByIdAsync(userId);
        }


        // Creates a new user after validating input and hashing the password
        public async Task<Users?> CreateNewUserAsync(Users user)
        {
            if (!IsUsernameValid(user))
            {
                return null;
            }

            if (!IsPasswordValid(user))
            {
                return null;
            }

            if (!IsFullNameValid(user))
            {
                return null;
            }

            if (!IsEmailValid(user))
            {
                return null;
            }

            if (!IsPhoneNumberValid(user))
            {
                return null;
            }

            if (!IsDateOfBirthValid(user))
            {
                return null;
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.CreatedAt = DateTime.Now;
            return await _usersRepository.CreateNewUserAsync(user);
        }


        // Updates profile fields while keeping existing values when optional fields are empty
        public async Task<Users?> UpdateUserAsync(int userId, UpdateUserRequest request)
        {
            var existUser = await _usersRepository.GetUserByIdAsync(userId);
            if (existUser == null)
            {
                return null;
            }

            var updatedUser = new Users
            {
                UserId = existUser.UserId,
                Username = string.IsNullOrWhiteSpace(request.Username) ? existUser.Username : request.Username,
                Password = existUser.Password,
                FullName = string.IsNullOrWhiteSpace(request.FullName) ? existUser.FullName : request.FullName,
                Email = string.IsNullOrWhiteSpace(request.Email) ? existUser.Email : request.Email,
                PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? existUser.PhoneNumber : request.PhoneNumber,
                DateOfBirth = request.DateOfBirth ?? existUser.DateOfBirth,
                CreatedAt = existUser.CreatedAt
            };

            // Password is only changed when a new password is provided
            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                var passwordUser = new Users
                {
                    Password = request.Password
                };

                if (!IsPasswordValid(passwordUser))
                {
                    return null;
                }

                updatedUser.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
            }

            if (!IsUsernameValid(updatedUser))
            {
                return null;
            }

            if (!IsFullNameValid(updatedUser))
            {
                return null;
            }

            if (!IsEmailValid(updatedUser))
            {
                return null;
            }

            if (!IsPhoneNumberValid(updatedUser))
            {
                return null;
            }

            if (!IsDateOfBirthValid(updatedUser))
            {
                return null;
            }

            return await _usersRepository.UpdateUserAsync(userId, updatedUser);
        }

        // Deletes a user only when the user has no open events or active bookings for open events
        public async Task<bool> DeleteUserAsync(int userId)
        {
            var existUser = await _usersRepository.GetUserByIdAsync(userId);
            if (existUser == null)
            {
                return false;
            }

            var events = await _eventsRepository.GetEventsByUserIdAsync(userId);
            foreach (var ev in events)
            {
                if (ev.Status == "Open")
                {
                    return false;
                }
            }

            var booking = await _bookingRepository.GetBookingByUserIdAsync(userId);
            foreach (var book in booking)
            {
                if (book.Status == "Active")
                {
                    var ev = await _eventsRepository.GetEventByIdAsync(book.EventId);
                    if (ev != null && ev.Status == "Open")
                    {
                        return false;
                    }
                }
            }

            return await _usersRepository.DeleteUserAsync(userId);
        }

        // Verifies login using either username or email and compares the password with the stored hash
        public async Task<Users?> LoginAsync(string usernameOrEmail, string password)
        {
            if (string.IsNullOrWhiteSpace(usernameOrEmail))
            {
                return null;
            }

            if (string.IsNullOrWhiteSpace(password))
            {
                return null;
            }

            var user = await _usersRepository.GetUserByUsernameOrEmailAsync(usernameOrEmail);
            if (user == null)
            {
                return null;
            }

            if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                return null;
            }

            return user;
        }
    }
}