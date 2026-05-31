using System.ComponentModel.DataAnnotations;

namespace TaskTracker.API.DTOs
{
    // DTO for creating a new project
    public class ProjectCreateDto
    {
        [Required(ErrorMessage = "Project name is required.")]
        [MaxLength(150, ErrorMessage = "Name cannot exceed 150 characters.")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string? Description { get; set; }

        public int? OwnerId { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        [MaxLength(50)]
        public string Status { get; set; } = "Not Started";
    }

    // DTO for updating an existing project
    public class ProjectUpdateDto
    {
        [Required(ErrorMessage = "Project name is required.")]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public int? OwnerId { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        [MaxLength(50)]
        public string Status { get; set; } = "Not Started";
    }

    // DTO for returning project data
    public class ProjectResponseDto
    {
        public int ProjectId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? OwnerId { get; set; }
        public string? OwnerName { get; set; }
        public string Status { get; set; } = "Not Started";
    }
}