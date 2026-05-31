using Microsoft.EntityFrameworkCore;
using TaskTracker.API.Data;
using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Repositories;

public class ProjectUpdateRepository(TaskDbContext dbContext) : IProjectUpdateRepository
{
    private readonly TaskDbContext _dbContext = dbContext;

    // Retrieve all project updates that may be filtered by projectId
    public async Task<IEnumerable<ProjectUpdate>> GetAllAsync(int? projectId = null)
    {
        var query = _dbContext.ProjectUpdates
            .Include(u => u.User)
            .AsQueryable();

        if (projectId.HasValue)
            query = query.Where(u => u.ProjectId == projectId.Value);

        return await query.OrderByDescending(u => u.CreatedAt).ToListAsync();
    }

    // Retrieve a project update by ID from the database with user data
    public async Task<ProjectUpdate?> GetByIdAsync(int id)
    {
        return await _dbContext.ProjectUpdates
            .Include(u => u.User)
            .FirstOrDefaultAsync(u => u.UpdateId == id);
    }

    // Create a new project update in the database
    public async Task<ProjectUpdate> CreateAsync(ProjectUpdate projectUpdate)
    {
        await _dbContext.ProjectUpdates.AddAsync(projectUpdate);
        await _dbContext.SaveChangesAsync();
        return projectUpdate;
    }

    // Update an existing project update in the database
    public async Task<ProjectUpdate?> UpdateAsync(int id, ProjectUpdate projectUpdate)
    {
        var existing = await _dbContext.ProjectUpdates.FirstOrDefaultAsync(u => u.UpdateId == id);
        if (existing is null) return null;

        existing.Title = projectUpdate.Title;
        existing.Content = projectUpdate.Content;
        await _dbContext.SaveChangesAsync();
        return existing;
    }

    // Delete a project update from the database
    public async Task<bool> DeleteAsync(int id)
    {
        var projectUpdate = await _dbContext.ProjectUpdates.FirstOrDefaultAsync(u => u.UpdateId == id);
        if (projectUpdate is null) return false;

        _dbContext.ProjectUpdates.Remove(projectUpdate);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}
