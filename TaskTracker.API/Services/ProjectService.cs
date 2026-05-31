using TaskTracker.API.DTOs;
using TaskTracker.API.Models.Domain;
using TaskTracker.API.Repositories;

namespace TaskTracker.API.Services;

public class ProjectService : IProjectService {
    private readonly IProjectRepository _repo;
    public ProjectService(IProjectRepository repo) => _repo = repo;

    // Retrieve all projects from the repository
    public Task<IEnumerable<Project>> GetAllProjectsAsync() => _repo.GetAllAsync();
    // Retrieve a project by ID from the repository
    public Task<Project?> GetProjectByIdAsync(int id) => _repo.GetByIdAsync(id);

    // Create a new project in the repository
    public Task<Project> CreateProjectAsync(ProjectCreateDto dto) {
        var project = new Project { Name = dto.Name, Description = dto.Description };
        return _repo.CreateAsync(project);
    }

    // Update an existing project in the repository
    public Task<Project?> UpdateProjectAsync(int id, ProjectUpdateDto dto) {
        var project = new Project { Name = dto.Name, Description = dto.Description };
        return _repo.UpdateAsync(id, project);
    }

    // Delete a project from the repository
    public Task<bool> DeleteProjectAsync(int id) => _repo.DeleteAsync(id);
}