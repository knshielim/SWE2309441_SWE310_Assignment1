using System.ComponentModel.DataAnnotations;

namespace TaskTracker.API.DTOs
{
    // DTO for creating a new user
    public class UserCreateDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Role is required.")]
        [MaxLength(50)]
        public string Role { get; set; } = "Member";
    }

    // DTO for updating an existing user
    public class UserUpdateDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Role is required.")]
        [MaxLength(50)]
        public string Role { get; set; } = "Member";
    }

    // DTO for returning user data
    public class UserResponseDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}