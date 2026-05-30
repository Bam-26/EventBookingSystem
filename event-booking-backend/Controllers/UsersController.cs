using Microsoft.AspNetCore.Mvc;
using EventBookingBackend.Models;
using EventBookingBackend.Services;
using EventBookingBackend.DTOs;

namespace EventBookingBackend.Controllers
{
    // Handles user API requests and delegates user validation and business rules to the user service
    [Route("api/user")]
    [ApiController]

    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        // Converts the user model into a safe response DTO without exposing the password hash
        private UserResponse ToUserResponse(Users user)
        {
            return new UserResponse
            {
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                DateOfBirth = user.DateOfBirth,
                CreatedAt = user.CreatedAt
            };
        }
        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }


        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            var user = await _usersService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new
                {
                    message = "User ID not found."
                });
            }

            return Ok(new
            {
                message = "User profile retrieved successfully.",
                data = ToUserResponse(user)
            });
        }


        [HttpPost("register")]
        public async Task<IActionResult> CreateNewUser([FromBody] Users user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed.",
                    errors = ModelState
                });
            }

            // User validation and password hashing are handled in the service
            var newUser = await _usersService.CreateNewUserAsync(user);
            if (newUser == null)
            {
                return BadRequest(new
                {
                    message = "Create user failed. Input may be invalid."
                });
            }

            return CreatedAtAction(
                nameof(GetUserById),
                new { userId = newUser.UserId },
                new
                {
                    message = "User created successfully.",
                    data = ToUserResponse(newUser)
                });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed.",
                    errors = ModelState
                });
            }

            // Login accepts either username or email, and password verification is handled by the service
            var user = await _usersService.LoginAsync(request.UsernameOrEmail, request.Password);
            if (user == null)
            {
                return BadRequest(new
                {
                    message = "Login failed. Username/email or password is incorrect."
                });
            }

            return Ok(new
            {
                message = "Login successfully.",
                data = ToUserResponse(user)
            });
        }

        [HttpPut("update/{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] UpdateUserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed.",
                    errors = ModelState
                });
            }

            // Partial profile updates and optional password changes are handled in the service
            var updatedUser = await _usersService.UpdateUserAsync(userId, request);
            if (updatedUser == null)
            {
                return BadRequest(new
                {
                    message = "Update user failed. User may not exist or input is invalid."
                });
            }

            return Ok(new
            {
                message = "User updated successfully.",
                data = ToUserResponse(updatedUser)
            });
        }

        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            // Users with active events or active bookings cannot be deleted
            var result = await _usersService.DeleteUserAsync(userId);
            if (result == false)
            {
                return BadRequest(new
                {
                    message = "Delete user failed. User not found, user still has active events, or user still has active bookings."
                });
            }

            return Ok(new
            {
                message = "User deleted successfully."
            });
        }
    }
}