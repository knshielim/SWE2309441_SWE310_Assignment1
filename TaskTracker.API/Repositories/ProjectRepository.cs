using Microsoft.EntityFrameworkCore;
using TaskTracker.API.Data;
using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Repositories
{
    public class ProjectRepository(TaskDbContext dbContext) : IProjectRepository
    {
        private readonly TaskDbContext _dbContext = dbContext;

        // Retrieve all projects from the database
        public async Task<IEnumerable<Project>> GetAllAsync()
        {
            return await _dbContext.Projects.ToListAsync();
        }

        // Retrieve a project by ID from the database
        public async Task<Project?> GetByIdAsync(int id)
        {
            return await _dbContext.Projects.FirstOrDefaultAsync(p => p.ProjectId == id);
        }

        // Create a new project in the database
        public async Task<Project> CreateAsync(Project project)
        {
            await _dbContext.Projects.AddAsync(project);
            await _dbContext.SaveChangesAsync();
            return project;
        }

        // Update an existing project in the database
        public async Task<Project?> UpdateAsync(int id, Project project)
        {
            var existingProject = await _dbContext.Projects.FirstOrDefaultAsync(p => p.ProjectId == id);
            if (existingProject == null) return null;

            existingProject.Name = project.Name;
            existingProject.Description = project.Description;
            existingProject.OwnerId = project.OwnerId;
            existingProject.Status = project.Status;

            await _dbContext.SaveChangesAsync();
            return existingProject;
        }

        // Delete a project from the database
        public async Task<bool> DeleteAsync(int id)
        {
            var project = await _dbContext.Projects.FirstOrDefaultAsync(p => p.ProjectId == id);
            if (project == null) return false;

            _dbContext.Projects.Remove(project);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}