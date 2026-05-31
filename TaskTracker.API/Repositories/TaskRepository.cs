using Microsoft.EntityFrameworkCore;
using TaskTracker.API.Data;
using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Repositories
{
    public class TaskRepository(TaskDbContext dbContext) : ITaskRepository
    {
        private readonly TaskDbContext _dbContext = dbContext;

        // Retrieve all tasks from the database
        public async Task<IEnumerable<TaskItem>> GetAllAsync()
        {
            return await _dbContext.Tasks.ToListAsync();
        }

        // Retrieve tasks filtered by status, priority, projectId, or search term
        public async Task<IEnumerable<TaskItem>> GetFilteredAsync(
            string? status, string? priority, int? projectId, string? search)
        {
            var query = _dbContext.Tasks.AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(t => t.Status == status);

            if (!string.IsNullOrWhiteSpace(priority))
                query = query.Where(t => t.Priority == priority);

            if (projectId.HasValue)
                query = query.Where(t => t.ProjectId == projectId.Value);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(t => t.Title.ToLower().Contains(term));
            }

            return await query.OrderBy(t => t.TaskId).ToListAsync();
        }

        // Retrieve a task by ID from the database
        public async Task<TaskItem?> GetByIdAsync(int id)
        {
            return await _dbContext.Tasks.FirstOrDefaultAsync(t => t.TaskId == id);
        }

        // Create a new task in the database
        public async Task<TaskItem> CreateAsync(TaskItem task)
        {
            await _dbContext.Tasks.AddAsync(task);
            await _dbContext.SaveChangesAsync();
            return task;
        }

        // Update an existing task in the database
        public async Task<TaskItem?> UpdateAsync(int id, TaskItem task)
        {
            var existingTask = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.TaskId == id);
            if (existingTask == null) return null;

            existingTask.Title = task.Title;
            existingTask.ProjectId = task.ProjectId;
            existingTask.AssignedTo = task.AssignedTo;
            existingTask.Priority = task.Priority;
            existingTask.Status = task.Status;
            existingTask.DueDate = task.DueDate;

            await _dbContext.SaveChangesAsync();
            return existingTask;
        }

        // Delete a task from the database
        public async Task<bool> DeleteAsync(int id)
        {
            var task = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.TaskId == id);
            if (task == null) return false;

            _dbContext.Tasks.Remove(task);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}