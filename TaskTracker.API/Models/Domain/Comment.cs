using System.ComponentModel.DataAnnotations;

namespace TaskTracker.API.Models.Domain;

public class Comment
{
    // Primary key for the comment
    public int CommentId { get; set; }

    // Foreign key to the task this comment belongs to
    public int TaskId { get; set; }
    // Navigation property to the task
    public TaskItem? Task { get; set; }

    // Foreign key to the user who wrote this comment
    public int UserId { get; set; }
    // Navigation property to the user
    public User? User { get; set; }

    // Comment content
    [Required, MaxLength(1000)]
    public string Content { get; set; } = string.Empty;

    // Timestamp when comment was created
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
