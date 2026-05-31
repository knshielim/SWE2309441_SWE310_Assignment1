using TaskTracker.API.DTOs;
using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Services;

public interface ITaskService {
    Task<IEnumerable<TaskItem>> GetAllTasksAsync();
    Task<IEnumerable<TaskItem>> GetTasksAsync(string? status, string? priority, int? projectId, string? search);
    Task<TaskItem?> GetTaskByIdAsync(int id);
    Task<string?> CheckRelatedRecordsAsync(int projectId, int? assignedTo);
    Task<TaskItem> CreateTaskAsync(TaskCreateDto dto);
    Task<TaskItem?> UpdateTaskAsync(int id, TaskUpdateDto dto);
    Task<bool> DeleteTaskAsync(int id);
}