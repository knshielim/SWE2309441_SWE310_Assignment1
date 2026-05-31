using System.ComponentModel.DataAnnotations;

namespace TaskTracker.API.Models.Domain;

public class ProjectUpdate
{
    // Primary key for the project update
    [Key]
    public int UpdateId { get; set; }

    // Foreign key to the project this update belongs to
    public int ProjectId { get; set; }
    // Navigation property to the project
    public Project? Project { get; set; }

    // Foreign key to the user who created this update
    public int UserId { get; set; }
    // Navigation property to the user
    public User? User { get; set; }

    // Update title
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    // Update content/details
    [Required, MaxLength(1000)]
    public string Content { get; set; } = string.Empty;

    // Timestamp when update was created
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
