using TaskTracker.API.DTOs;
using TaskTracker.API.Models.Domain;
using TaskTracker.API.Repositories;

namespace TaskTracker.API.Services;

public class UserService : IUserService {
    private readonly IUserRepository _repo;
    public UserService(IUserRepository repo) => _repo = repo;

    // Retrieve all users from the repository
    public Task<IEnumerable<User>> GetAllUsersAsync() => _repo.GetAllAsync();
    // Retrieve a user by ID from the repository
    public Task<User?> GetUserByIdAsync(int id) => _repo.GetByIdAsync(id);

    // Check before create/update so we can return 400
    public async Task<string?> CheckEmailAvailableAsync(string email, int? ignoreUserId = null)
    {
        var existing = await _repo.GetByEmailAsync(email);
        if (existing is not null && existing.UserId != ignoreUserId)
            return "This email address is already in use.";
        return null;
    }

    // Create a new user in the repository
    public Task<User> CreateUserAsync(UserCreateDto dto) {
        var user = new User { Name = dto.Name, Email = dto.Email, Role = dto.Role };
        return _repo.CreateAsync(user);
    }

    // Update an existing user in the repository
    public Task<User?> UpdateUserAsync(int id, UserUpdateDto dto) {
        var user = new User { Name = dto.Name, Email = dto.Email, Role = dto.Role };
        return _repo.UpdateAsync(id, user);
    }

    // Delete a user from the repository
    public Task<bool> DeleteUserAsync(int id) => _repo.DeleteAsync(id);
}
