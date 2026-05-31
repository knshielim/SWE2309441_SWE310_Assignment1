using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Repositories;

public interface IProjectUpdateRepository
{
    Task<IEnumerable<ProjectUpdate>> GetAllAsync(int? projectId = null);
    Task<ProjectUpdate?> GetByIdAsync(int id);
    Task<ProjectUpdate> CreateAsync(ProjectUpdate projectUpdate);
    Task<ProjectUpdate?> UpdateAsync(int id, ProjectUpdate projectUpdate);
    Task<bool> DeleteAsync(int id);
}
