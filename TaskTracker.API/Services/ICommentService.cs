using TaskTracker.API.DTOs;
using TaskTracker.API.Models.Domain;

namespace TaskTracker.API.Services;

public interface ICommentService
{
    Task<IEnumerable<Comment>> GetAllCommentsAsync(int? taskId = null);
    Task<Comment?> GetCommentByIdAsync(int id);
    Task<string?> ValidateCommentAsync(int taskId, int userId);
    Task<Comment> CreateCommentAsync(CommentCreateDto dto);
    Task<Comment?> UpdateCommentAsync(int id, CommentUpdateDto dto);
    Task<bool> DeleteCommentAsync(int id);
}
