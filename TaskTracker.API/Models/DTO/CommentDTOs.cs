using System.ComponentModel.DataAnnotations;

namespace TaskTracker.API.DTOs;

// DTO for creating a new comment
public class CommentCreateDto
{
    [Required(ErrorMessage = "Task id is required.")]
    public int TaskId { get; set; }

    [Required(ErrorMessage = "User id is required.")]
    public int UserId { get; set; }

    [Required(ErrorMessage = "Comment content is required.")]
    [MaxLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters.")]
    public string Content { get; set; } = string.Empty;
}

// DTO for updating an existing comment
public class CommentUpdateDto
{
    [Required(ErrorMessage = "Comment content is required.")]
    [MaxLength(1000)]
    public string Content { get; set; } = string.Empty;
}

// DTO for returning comment data
public class CommentResponseDto
{
    public int CommentId { get; set; }
    public int TaskId { get; set; }
    public int UserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? AuthorName { get; set; }
}
