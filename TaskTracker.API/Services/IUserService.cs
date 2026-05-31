using TaskTracker.API.DTOs;
using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Services;

public interface IUserService {
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<User?> GetUserByIdAsync(int id);
    Task<string?> CheckEmailAvailableAsync(string email, int? ignoreUserId = null);
    Task<User> CreateUserAsync(UserCreateDto dto);
    Task<User?> UpdateUserAsync(int id, UserUpdateDto dto);
    Task<bool> DeleteUserAsync(int id);
}