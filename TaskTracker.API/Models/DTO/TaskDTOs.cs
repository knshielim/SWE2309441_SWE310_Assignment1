using System.ComponentModel.DataAnnotations;

namespace TaskTracker.API.DTOs
{
    // DTO for creating a new task
    public class TaskCreateDto
    {
        [Required(ErrorMessage = "Task title is required.")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Project ID is required.")]
        public int ProjectId { get; set; }

        public int? AssignedTo { get; set; } // Matches your DB column name perfectly

        [RegularExpression("^(Low|Medium|High)$", ErrorMessage = "Priority must be Low, Medium, or High.")]
        public string Priority { get; set; } = "Medium";

        [RegularExpression("^(To Do|In Progress|Completed)$", ErrorMessage = "Status must be 'To Do', 'In Progress', or 'Completed'.")]
        public string Status { get; set; } = "To Do";

        public DateTime? DueDate { get; set; }
    }

    // DTO for updating an existing task
    public class TaskUpdateDto
    {
        [Required(ErrorMessage = "Task title is required.")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Project ID is required.")]
        public int ProjectId { get; set; }

        public int? AssignedTo { get; set; }

        [RegularExpression("^(Low|Medium|High)$", ErrorMessage = "Priority must be Low, Medium, or High.")]
        public string Priority { get; set; } = "Medium";

        [RegularExpression("^(To Do|In Progress|Completed)$", ErrorMessage = "Status must be 'To Do', 'In Progress', or 'Completed'.")]
        public string Status { get; set; } = "To Do";

        public DateTime? DueDate { get; set; }
    }

    // DTO for returning task data
    public class TaskResponseDto
    {
        public int TaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public int ProjectId { get; set; }
        public int? AssignedTo { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}