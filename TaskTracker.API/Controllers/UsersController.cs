using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTracker.API.DTOs;
using TaskTracker.API.Helpers;
using TaskTracker.API.Services;

namespace TaskTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service) => _service = service;

    // GET /api/users - Retrieve all users
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var users = await _service.GetAllUsersAsync();

            var userDTOs = users.Select(u => new UserResponseDto
            {
                UserId = u.UserId,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt
            }).ToList();

            return Ok(userDTOs); // 200 OK
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not load users. Please try again later." }); // 500 Internal Server Error
        }
    }

    // GET /api/users/{id} - Retrieve a specific user by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid user id." }); // 400 Bad Request

        try
        {
            var user = await _service.GetUserByIdAsync(id);

            if (user is null)
                return NotFound(new { message = $"User {id} not found." }); // 404 Not Found

            var userDTO = new UserResponseDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            return Ok(userDTO); // 200 OK
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not load the user. Please try again later." }); // 500 Internal Server Error
        }
    }

    // POST /api/users - Create a new user
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState); // 400 Bad Request

        var emailError = await _service.CheckEmailAvailableAsync(dto.Email);
        if (emailError is not null)
            return BadRequest(new { message = emailError }); // 400 Bad Request

        try
        {
            var created = await _service.CreateUserAsync(dto);

            var responseDTO = new UserResponseDto
            {
                UserId = created.UserId,
                Name = created.Name,
                Email = created.Email,
                Role = created.Role,
                CreatedAt = created.CreatedAt
            };
            return CreatedAtAction(nameof(GetById), new { id = created.UserId }, responseDTO); // 201 Created
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = DbExceptionHelper.GetFriendlyMessage(ex) }); // 400 Bad Request
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not create the user. Please try again later." }); // 500 Internal Server Error
        }
    }

    // PUT /api/users/{id} - Update an existing user
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto dto)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid user id." }); // 400 Bad Request

        if (!ModelState.IsValid)
            return BadRequest(ModelState); // 400 Bad Request

        var emailError = await _service.CheckEmailAvailableAsync(dto.Email, id);
        if (emailError is not null)
            return BadRequest(new { message = emailError }); // 400 Bad Request

        try
        {
            var updated = await _service.UpdateUserAsync(id, dto);
            if (updated is null)
                return NotFound(new { message = $"User {id} not found." }); // 404 Not Found

            var responseDTO = new UserResponseDto
            {
                UserId = updated.UserId,
                Name = updated.Name,
                Email = updated.Email,
                Role = updated.Role,
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
            return StatusCode(500, new { message = "Could not update the user. Please try again later." }); // 500 Internal Server Error
        }
    }

    // DELETE /api/users/{id} - Delete a user by ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0)
            return BadRequest(new { message = "Please provide a valid user id." }); // 400 Bad Request

        try
        {
            var deleted = await _service.DeleteUserAsync(id);

            if (!deleted)
                return NotFound(new { message = $"User {id} not found." }); // 404 Not Found

            return NoContent(); // 204 No Content
        }
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = DbExceptionHelper.GetFriendlyMessage(ex) }); // 400 Bad Request
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not delete the user. Please try again later." }); // 500 Internal Server Error
        }
    }
}
