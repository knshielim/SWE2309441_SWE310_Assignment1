using TaskTracker.API.DTOs;
using TaskTracker.API.Models.Domain;
using TaskTracker.API.Repositories;

namespace TaskTracker.API.Services;

public class TaskService : ITaskService {
    private readonly ITaskRepository _taskRepo;
    private readonly IProjectRepository _projectRepo;
    private readonly IUserRepository _userRepo;

    public TaskService(
        ITaskRepository taskRepo,
        IProjectRepository projectRepo,
        IUserRepository userRepo)
    {
        _taskRepo = taskRepo;
        _projectRepo = projectRepo;
        _userRepo = userRepo;
    }

    // Retrieve all tasks from the repository
    public Task<IEnumerable<TaskItem>> GetAllTasksAsync() => _taskRepo.GetAllAsync();

    public Task<IEnumerable<TaskItem>> GetTasksAsync(
        string? status, string? priority, int? projectId, string? search)
    {
        var hasFilter = !string.IsNullOrWhiteSpace(status)
            || !string.IsNullOrWhiteSpace(priority)
            || projectId.HasValue
            || !string.IsNullOrWhiteSpace(search);

        return hasFilter
            ? _taskRepo.GetFilteredAsync(status, priority, projectId, search)
            : _taskRepo.GetAllAsync();
    }
    // Retrieve a task by ID from the repository
    public Task<TaskItem?> GetTaskByIdAsync(int id) => _taskRepo.GetByIdAsync(id);

    // Make sure project and assignee exist before we try to save
    public async Task<string?> CheckRelatedRecordsAsync(int projectId, int? assignedTo)
    {
        if (await _projectRepo.GetByIdAsync(projectId) is null)
            return $"Project with id {projectId} does not exist.";

        if (assignedTo.HasValue && await _userRepo.GetByIdAsync(assignedTo.Value) is null)
            return $"User with id {assignedTo} does not exist.";

        return null;
    }

    // Create a new task in the repository
    public Task<TaskItem> CreateTaskAsync(TaskCreateDto dto) {
        var task = new TaskItem {
            Title = dto.Title, Status = dto.Status, Priority = dto.Priority,
            DueDate = dto.DueDate, ProjectId = dto.ProjectId, AssignedTo = dto.AssignedTo
        };
        return _taskRepo.CreateAsync(task);
    }

    // Update an existing task in the repository
    public Task<TaskItem?> UpdateTaskAsync(int id, TaskUpdateDto dto) {
        var task = new TaskItem {
            Title = dto.Title, Status = dto.Status, Priority = dto.Priority,
            DueDate = dto.DueDate, ProjectId = dto.ProjectId, AssignedTo = dto.AssignedTo
        };
        return _taskRepo.UpdateAsync(id, task);
    }

    // Delete a task from the repository
    public Task<bool> DeleteTaskAsync(int id) => _taskRepo.DeleteAsync(id);
}
