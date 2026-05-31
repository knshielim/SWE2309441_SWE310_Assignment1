using TaskTracker.API.DTOs;
using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Services;

public interface IProjectUpdateService
{
    Task<IEnumerable<ProjectUpdate>> GetAllProjectUpdatesAsync(int? projectId = null);
    Task<ProjectUpdate?> GetProjectUpdateByIdAsync(int id);
    Task<string?> ValidateProjectUpdateAsync(int projectId, int userId);
    Task<ProjectUpdate> CreateProjectUpdateAsync(ProjectUpdateCreateDto dto);
    Task<ProjectUpdate?> UpdateProjectUpdateAsync(int id, ProjectUpdateUpdateDto dto);
    Task<bool> DeleteProjectUpdateAsync(int id);
}
