using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Repositories
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskItem>> GetAllAsync();
        Task<IEnumerable<TaskItem>> GetFilteredAsync(string? status, string? priority, int? projectId, string? search);
        Task<TaskItem?> GetByIdAsync(int id);
        Task<TaskItem> CreateAsync(TaskItem task);
        Task<TaskItem?> UpdateAsync(int id, TaskItem task);
        Task<bool> DeleteAsync(int id);
    }
}