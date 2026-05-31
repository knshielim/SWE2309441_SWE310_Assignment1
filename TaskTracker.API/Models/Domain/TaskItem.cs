using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskTracker.API.Models.Domain;

public class TaskItem {
    // Primary key for the task
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

    public int TaskId { get; set; }

    // Task title
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    // Task description
    [MaxLength(1000)]
    public string? Description { get; set; }

    // Task status (To Do, In Progress, Completed)
    [MaxLength(50)]
    public string Status { get; set; } = "To Do";

    // Task priority (Low, Medium, High)
    [MaxLength(50)]
    public string Priority { get; set; } = "Medium";

    // Due date for the task
    public DateTime? DueDate { get; set; }

    // Timestamp when task was created
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key to the project this task belongs to
    [Required]
    public int ProjectId { get; set; }
    // Navigation property to the project
    public Project? Project { get; set; }

    // Foreign key to the user assigned to this task
    public int? AssignedTo { get; set; }
    // Navigation property to the assigned user
    public User? AssignedUser { get; set; }

    // Navigation to comments on this task
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
