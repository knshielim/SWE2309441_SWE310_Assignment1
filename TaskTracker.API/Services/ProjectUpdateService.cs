using TaskTracker.API.DTOs;
using TaskTracker.API.Models.Domain;
using TaskTracker.API.Repositories;

namespace TaskTracker.API.Services;

public class ProjectUpdateService : IProjectUpdateService
{
    private readonly IProjectUpdateRepository _projectUpdateRepo;
    private readonly IProjectRepository _projectRepo;
    private readonly IUserRepository _userRepo;

    public ProjectUpdateService(
        IProjectUpdateRepository projectUpdateRepo,
        IProjectRepository projectRepo,
        IUserRepository userRepo)
    {
        _projectUpdateRepo = projectUpdateRepo;
        _projectRepo = projectRepo;
        _userRepo = userRepo;
    }

    // Retrieve all project updates that may be filtered by projectId
    public Task<IEnumerable<ProjectUpdate>> GetAllProjectUpdatesAsync(int? projectId = null) =>
        _projectUpdateRepo.GetAllAsync(projectId);

    // Retrieve a project update by ID from the repository
    public Task<ProjectUpdate?> GetProjectUpdateByIdAsync(int id) => _projectUpdateRepo.GetByIdAsync(id);

    // Validate that project and user exist before creating update
    public async Task<string?> ValidateProjectUpdateAsync(int projectId, int userId)
    {
        if (await _projectRepo.GetByIdAsync(projectId) is null)
            return $"Project with id {projectId} does not exist.";

        if (await _userRepo.GetByIdAsync(userId) is null)
            return $"User with id {userId} does not exist.";

        return null;
    }

    // Create a new project update in the repository
    public Task<ProjectUpdate> CreateProjectUpdateAsync(ProjectUpdateCreateDto dto)
    {
        var projectUpdate = new ProjectUpdate
        {
            ProjectId = dto.ProjectId,
            UserId = dto.UserId,
            Title = dto.Title,
            Content = dto.Content
        };
        return _projectUpdateRepo.CreateAsync(projectUpdate);
    }

    // Update an existing project update in the repository
    public Task<ProjectUpdate?> UpdateProjectUpdateAsync(int id, ProjectUpdateUpdateDto dto)
    {
        var projectUpdate = new ProjectUpdate
        {
            Title = dto.Title,
            Content = dto.Content
        };
        return _projectUpdateRepo.UpdateAsync(id, projectUpdate);
    }

    // Delete a project update from the repository
    public Task<bool> DeleteProjectUpdateAsync(int id) => _projectUpdateRepo.DeleteAsync(id);
}
