using System.ComponentModel.DataAnnotations;

namespace TaskTracker.API.Models.Domain;

public class Project {
    // Primary key for the project
    public int ProjectId { get; set; }

    // Project name
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    // Project description
    [MaxLength(500)]
    public string? Description { get; set; }

    // Timestamp when project was created
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key to the user who owns this project
    public int? OwnerId { get; set; }

    // Navigation property to the owner user
    public User? Owner { get; set; }

    // Project status (Not Started, In Progress, Completed)
    [Required, MaxLength(50)]
    public string Status { get; set; } = "Not Started";

    // Navigation
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    public ICollection<ProjectUpdate> Updates { get; set; } = new List<ProjectUpdate>();
}
