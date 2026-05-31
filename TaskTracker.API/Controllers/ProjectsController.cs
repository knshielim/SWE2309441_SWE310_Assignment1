using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTracker.API.DTOs;
using TaskTracker.API.Helpers;
using TaskTracker.API.Services;

namespace TaskTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _service;

    public ProjectsController(IProjectService service) => _service = service;

    // GET /api/projects - Retrieve all projects
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var projects = await _service.GetAllProjectsAsync();

            var projectDTOs = projects.Select(p => new ProjectResponseDto
            {
                ProjectId = p.ProjectId,
                Name = p.Name,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                OwnerId = p.OwnerId,
                OwnerName = p.Owner?.Name,
                Status = p.Status
            }).ToList();

            return Ok(projectDTOs); // 200 OK
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not load projects. Please try again later." }); // 500 Internal Server Error
        }
    }

    // GET /api/projects/{id} - Retrieve a specific project by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid project id." }); // 400 Bad Request

        try
        {
            var project = await _service.GetProjectByIdAsync(id);

            if (project is null)
                return NotFound(new { message = $"Project {id} not found." }); // 404 Not Found

            var projectDTO = new ProjectResponseDto
            {
                ProjectId = project.ProjectId,
                Name = project.Name,
                Description = project.Description,
                CreatedAt = project.CreatedAt,
                OwnerId = project.OwnerId,
                OwnerName = project.Owner?.Name,
                Status = project.Status
            };

            return Ok(projectDTO); // 200 OK
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not load the project. Please try again later." }); // 500 Internal Server Error
        }
    }

    // POST /api/projects - Create a new project
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProjectCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState); // 400 Bad Request

        try
        {
            var created = await _service.CreateProjectAsync(dto);

            var responseDTO = new ProjectResponseDto
            {
                ProjectId = created.ProjectId,
                Name = created.Name,
                Description = created.Description,
                CreatedAt = created.CreatedAt,
                OwnerId = created.OwnerId,
                OwnerName = created.Owner?.Name,
                Status = created.Status
            };
            return CreatedAtAction(nameof(GetById), new { id = created.ProjectId }, responseDTO); // 201 Created
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = DbExceptionHelper.GetFriendlyMessage(ex) }); // 400 Bad Request
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not create the project. Please try again later." }); // 500 Internal Server Error
        }
    }

    // PUT /api/projects/{id} - Update an existing project
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProjectUpdateDto dto)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid project id." }); // 400 Bad Request

        if (!ModelState.IsValid)
            return BadRequest(ModelState); // 400 Bad Request

        try
        {
            var updated = await _service.UpdateProjectAsync(id, dto);
            if (updated is null)
                return NotFound(new { message = $"Project {id} not found." }); // 404 Not Found

            var responseDTO = new ProjectResponseDto
            {
                ProjectId = updated.ProjectId,
                Name = updated.Name,
                Description = updated.Description,
                CreatedAt = updated.CreatedAt,
                OwnerId = updated.OwnerId,
                OwnerName = updated.Owner?.Name,
                Status = updated.Status
            };
            return Ok(responseDTO); // 200 OK
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = DbExceptionHelper.GetFriendlyMessage(ex) }); // 400 Bad Request
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not update the project. Please try again later." }); // 500 Internal Server Error
        }
    }

    // DELETE /api/projects/{id} - Delete a project by ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid project id." }); // 400 Bad Request

        try
        {
            var deleted = await _service.DeleteProjectAsync(id);

            if (!deleted)
                return NotFound(new { message = $"Project {id} not found." }); // 404 Not Found

            return NoContent(); // 204 No Content
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = DbExceptionHelper.GetFriendlyMessage(ex) }); // 400 Bad Request
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not delete the project. Please try again later." }); // 500 Internal Server Error
        }
    }
}
