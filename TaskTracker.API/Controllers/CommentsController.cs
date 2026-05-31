using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTracker.API.DTOs;
using TaskTracker.API.Helpers;
using TaskTracker.API.Models.Domain;
using TaskTracker.API.Services;

namespace TaskTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _service;

    public CommentsController(ICommentService service) => _service = service;

    // GET /api/comments - Retrieve all comments, optionally filtered by taskId
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? taskId)
    {
        try
        {
            var comments = await _service.GetAllCommentsAsync(taskId);
            var dtos = comments.Select(ToDto).ToList();
            return Ok(dtos); // 200 OK
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not load comments. Please try again later." }); // 500 Internal Server Error
        }
    }

    // GET /api/comments/{id} - Retrieve a specific comment by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid comment id." }); // 400 Bad Request

        try
        {
            var comment = await _service.GetCommentByIdAsync(id);
            if (comment is null)
                return NotFound(new { message = $"Comment {id} not found." }); // 404 Not Found

            return Ok(ToDto(comment)); // 200 OK
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not load the comment. Please try again later." }); // 500 Internal Server Error
        }
    }

    // POST /api/comments - Create a new comment
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CommentCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState); // 400 Bad Request

        var validationError = await _service.ValidateCommentAsync(dto.TaskId, dto.UserId);
        if (validationError is not null)
            return BadRequest(new { message = validationError }); // 400 Bad Request

        try
        {
            var created = await _service.CreateCommentAsync(dto);
            var loaded = await _service.GetCommentByIdAsync(created.CommentId);
            return CreatedAtAction(nameof(GetById), new { id = created.CommentId }, ToDto(loaded!)); // 201 Created
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = DbExceptionHelper.GetFriendlyMessage(ex) }); // 400 Bad Request
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not create the comment. Please try again later." }); // 500 Internal Server Error
        }
    }

    // PUT /api/comments/{id} - Update an existing comment
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CommentUpdateDto dto)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid comment id." }); // 400 Bad Request

        if (!ModelState.IsValid)
            return BadRequest(ModelState); // 400 Bad Request

        try
        {
            var updated = await _service.UpdateCommentAsync(id, dto);
            if (updated is null)
                return NotFound(new { message = $"Comment {id} not found." }); // 404 Not Found

            var loaded = await _service.GetCommentByIdAsync(id);
            return Ok(ToDto(loaded!)); // 200 OK
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = DbExceptionHelper.GetFriendlyMessage(ex) }); // 400 Bad Request
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not update the comment. Please try again later." }); // 500 Internal Server Error
        }
    }

    // DELETE /api/comments/{id} - Delete a comment by ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid comment id." }); // 400 Bad Request

        try
        {
            var deleted = await _service.DeleteCommentAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Comment {id} not found." }); // 404 Not Found

            return NoContent(); // 204 No Content
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not delete the comment. Please try again later." }); // 500 Internal Server Error
        }
    }

    private static CommentResponseDto ToDto(Comment c) => new()
    {
        CommentId = c.CommentId,
        TaskId = c.TaskId,
        UserId = c.UserId,
        Content = c.Content,
        CreatedAt = c.CreatedAt,
        AuthorName = c.User?.Name
    };
}
