using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTracker.API.DTOs;
using TaskTracker.API.Helpers;
using TaskTracker.API.Models.Domain;
using TaskTracker.API.Services;

namespace TaskTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectUpdatesController : ControllerBase
{
    private readonly IProjectUpdateService _service;

    public ProjectUpdatesController(IProjectUpdateService service) => _service = service;

    // GET /api/projectupdates - Retrieve all updates, optionally filtered by projectId
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? projectId)
    {
        try
        {
            var updates = await _service.GetAllProjectUpdatesAsync(projectId);
            var dtos = updates.Select(ToDto).ToList();
            return Ok(dtos); // 200 OK
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not load project updates. Please try again later." }); // 500 Internal Server Error
        }
    }

    // GET /api/projectupdates/{id} - Retrieve a specific update by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid update id." }); // 400 Bad Request

        try
        {
            var update = await _service.GetProjectUpdateByIdAsync(id);
            if (update is null)
                return NotFound(new { message = $"Project update {id} not found." }); // 404 Not Found

            return Ok(ToDto(update)); // 200 OK
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not load the project update. Please try again later." }); // 500 Internal Server Error
        }
    }

    // POST /api/projectupdates - Create a new project update
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProjectUpdateCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState); // 400 Bad Request

        var validationError = await _service.ValidateProjectUpdateAsync(dto.ProjectId, dto.UserId);
        if (validationError is not null)
            return BadRequest(new { message = validationError }); // 400 Bad Request

        try
        {
            var created = await _service.CreateProjectUpdateAsync(dto);
            var loaded = await _service.GetProjectUpdateByIdAsync(created.UpdateId);
            return CreatedAtAction(nameof(GetById), new { id = created.UpdateId }, ToDto(loaded!)); // 201 Created
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = DbExceptionHelper.GetFriendlyMessage(ex) }); // 400 Bad Request
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not create the project update. Please try again later." }); // 500 Internal Server Error
        }
    }

    // PUT /api/projectupdates/{id} - Update an existing project update
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProjectUpdateUpdateDto dto)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid update id." }); // 400 Bad Request

        if (!ModelState.IsValid)
            return BadRequest(ModelState); // 400 Bad Request

        try
        {
            var updated = await _service.UpdateProjectUpdateAsync(id, dto);
            if (updated is null)
                return NotFound(new { message = $"Project update {id} not found." }); // 404 Not Found

            var loaded = await _service.GetProjectUpdateByIdAsync(id);
            return Ok(ToDto(loaded!)); // 200 OK
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = DbExceptionHelper.GetFriendlyMessage(ex) }); // 400 Bad Request
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not update the project update. Please try again later." }); // 500 Internal Server Error
        }
    }

    // DELETE /api/projectupdates/{id} - Delete a project update by ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid update id." }); // 400 Bad Request

        try
        {
            var deleted = await _service.DeleteProjectUpdateAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Project update {id} not found." }); // 404 Not Found

            return NoContent(); // 204 No Content
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not delete the project update. Please try again later." }); // 500 Internal Server Error
        }
    }

    private static ProjectUpdateResponseDto ToDto(ProjectUpdate u) => new()
    {
        UpdateId = u.UpdateId,
        ProjectId = u.ProjectId,
        UserId = u.UserId,
        Title = u.Title,
        Content = u.Content,
        CreatedAt = u.CreatedAt,
        AuthorName = u.User?.Name
    };
}
