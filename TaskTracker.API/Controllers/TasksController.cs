using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTracker.API.DTOs;
using TaskTracker.API.Helpers;
using TaskTracker.API.Services;

namespace TaskTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _service;

    public TasksController(ITaskService service) => _service = service;

    // Optional filters
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? priority,
        [FromQuery] int? projectId,
        [FromQuery] string? search)
    {
        try
        {
            var tasks = await _service.GetTasksAsync(status, priority, projectId, search);

            var taskDTOs = tasks.Select(t => new TaskResponseDto
            {
                TaskId = t.TaskId,
                Title = t.Title,
                Status = t.Status,
                Priority = t.Priority,
                DueDate = t.DueDate,
                ProjectId = t.ProjectId,
                AssignedTo = t.AssignedTo,
                CreatedAt = t.CreatedAt
            }).ToList();

            return Ok(taskDTOs); // 200 OK
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not load tasks. Please try again later." }); // 500 Internal Server Error
        }
    }

    // GET /api/tasks/{id} - Retrieve a specific task by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid task id." }); // 400 Bad Request

        try
        {
            var task = await _service.GetTaskByIdAsync(id);

            if (task is null)
                return NotFound(new { message = $"Task {id} not found." }); // 404 Not Found

            var taskDTO = new TaskResponseDto
            {
                TaskId = task.TaskId,
                Title = task.Title,
                Status = task.Status,
                Priority = task.Priority,
                DueDate = task.DueDate,
                ProjectId = task.ProjectId,
                AssignedTo = task.AssignedTo,
                CreatedAt = task.CreatedAt
            };

            return Ok(taskDTO); // 200 OK
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not load the task. Please try again later." }); // 500 Internal Server Error
        }
    }

    // POST /api/tasks - Create a new task
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TaskCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState); // 400 Bad Request

        var relatedError = await _service.CheckRelatedRecordsAsync(dto.ProjectId, dto.AssignedTo);
        if (relatedError is not null)
            return BadRequest(new { message = relatedError }); // 400 Bad Request

        try
        {
            var created = await _service.CreateTaskAsync(dto);

            var responseDTO = new TaskResponseDto
            {
                TaskId = created.TaskId,
                Title = created.Title,
                Status = created.Status,
                Priority = created.Priority,
                DueDate = created.DueDate,
                ProjectId = created.ProjectId,
                AssignedTo = created.AssignedTo,
                CreatedAt = created.CreatedAt
            };
            return CreatedAtAction(nameof(GetById), new { id = created.TaskId }, responseDTO); // 201 Created
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = DbExceptionHelper.GetFriendlyMessage(ex) }); // 400 Bad Request
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not create the task. Please try again later." }); // 500 Internal Server Error
        }
    }

    // PUT /api/tasks/{id} - Update an existing task
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TaskUpdateDto dto)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid task id." }); // 400 Bad Request

        if (!ModelState.IsValid)
            return BadRequest(ModelState); // 400 Bad Request

        var relatedError = await _service.CheckRelatedRecordsAsync(dto.ProjectId, dto.AssignedTo);
        if (relatedError is not null)
            return BadRequest(new { message = relatedError }); // 400 Bad Request

        try
        {
            var updated = await _service.UpdateTaskAsync(id, dto);
            if (updated is null)
                return NotFound(new { message = $"Task {id} not found." }); // 404 Not Found

            var responseDTO = new TaskResponseDto
            {
                TaskId = updated.TaskId,
                Title = updated.Title,
                Status = updated.Status,
                Priority = updated.Priority,
                DueDate = updated.DueDate,
                ProjectId = updated.ProjectId,
                AssignedTo = updated.AssignedTo,
                CreatedAt = updated.CreatedAt
            };
            return Ok(responseDTO); // 200 OK
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = DbExceptionHelper.GetFriendlyMessage(ex) }); // 400 Bad Request
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not update the task. Please try again later." }); // 500 Internal Server Error
        }
    }

    // DELETE /api/tasks/{id} - Delete a task by ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid task id." }); // 400 Bad Request

        try
        {
            var deleted = await _service.DeleteTaskAsync(id);

            if (!deleted)
                return NotFound(new { message = $"Task {id} not found." }); // 404 Not Found

            return NoContent(); // 204 No Content
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = DbExceptionHelper.GetFriendlyMessage(ex) }); // 400 Bad Request
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not delete the task. Please try again later." }); // 500 Internal Server Error
        }
    }
}
