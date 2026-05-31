using TaskTracker.API.DTOs;
using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Services;

public interface IProjectService {
    Task<IEnumerable<Project>> GetAllProjectsAsync();
    Task<Project?> GetProjectByIdAsync(int id);
    Task<Project> CreateProjectAsync(ProjectCreateDto dto);
    Task<Project?> UpdateProjectAsync(int id, ProjectUpdateDto dto);
    Task<bool> DeleteProjectAsync(int id);
}