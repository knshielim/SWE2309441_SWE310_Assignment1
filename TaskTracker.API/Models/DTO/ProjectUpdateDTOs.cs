using System.ComponentModel.DataAnnotations;

namespace TaskTracker.API.DTOs;

// DTO for creating a new project update
public class ProjectUpdateCreateDto
{
    [Required(ErrorMessage = "Project id is required.")]
    public int ProjectId { get; set; }

    [Required(ErrorMessage = "User id is required.")]
    public int UserId { get; set; }

    [Required(ErrorMessage = "Update title is required.")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Update content is required.")]
    [MaxLength(1000, ErrorMessage = "Content cannot exceed 1000 characters.")]
    public string Content { get; set; } = string.Empty;
}

// DTO for updating an existing project update
public class ProjectUpdateUpdateDto
{
    [Required(ErrorMessage = "Update title is required.")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Update content is required.")]
    [MaxLength(1000, ErrorMessage = "Content cannot exceed 1000 characters.")]
    public string Content { get; set; } = string.Empty;
}

// DTO for returning project update data
public class ProjectUpdateResponseDto
{
    public int UpdateId { get; set; }
    public int ProjectId { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? AuthorName { get; set; }
}
