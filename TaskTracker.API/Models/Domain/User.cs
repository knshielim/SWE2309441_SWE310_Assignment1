using System.ComponentModel.DataAnnotations;

namespace TaskTracker.API.Models.Domain;

public class User {
    // Primary key for the user
    public int UserId { get; set; }

    // Full name of the user
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    // Email address (unique)
    [Required, MaxLength(150), EmailAddress]
    public string Email { get; set; } = string.Empty;

    // User role in the system
    [MaxLength(50)]
    public string Role { get; set; } = "Member";

    // Timestamp when user was created
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<ProjectUpdate> ProjectUpdates { get; set; } = new List<ProjectUpdate>();
}
